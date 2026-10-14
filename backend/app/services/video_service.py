"""
AI-PAVE Video Analysis & Multi-Object Pavement Defect Tracking Engine
Extracts video frames, detects & segments potholes, tracks defects across frames
to avoid double-counting, reconstructs annotated video, and aggregates analytics.
"""

import time
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
import cv2
import numpy as np

from app.core.config import settings
from app.core.logging import logger
from app.ml.detector import YOLODetector
from app.ml.segmenter import YOLOSegmenter
from app.ml.depth_model import MonocularDepthModel
from app.ml.postprocessing import render_combined_overlay
from app.services.measurement_service import measurement_service
from app.services.severity_service import severity_service
from app.services.recommendation_service import recommendation_service
from app.services.report_service import report_service

class PotholeTracker:
    """
    IoU & Centroid Kalman-style Multi-Object Association Tracker.
    Maintains persistent track IDs across frames and avoids duplicate counting.
    """
    def __init__(self, iou_thresh: float = 0.35, max_disappeared: int = 15):
        self.next_track_id = 1
        self.tracks = {} # track_id -> {"bbox": [], "disappeared": 0, "max_conf": float, "history": []}
        self.iou_thresh = iou_thresh
        self.max_disappeared = max_disappeared
        self.completed_tracks = [] # persistent catalog of unique potholes

    def update(self, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Associates frame detections to existing tracks or creates new ones.
        Returns detections augmented with 'track_id'.
        """
        if len(detections) == 0:
            for tid in list(self.tracks.keys()):
                self.tracks[tid]["disappeared"] += 1
                if self.tracks[tid]["disappeared"] > self.max_disappeared:
                    self.completed_tracks.append(self.tracks[tid])
                    del self.tracks[tid]
            return []

        # If no active tracks, register all as new
        if len(self.tracks) == 0:
            for d in detections:
                tid = self.next_track_id
                self.next_track_id += 1
                self.tracks[tid] = {
                    "track_id": tid,
                    "bbox": d["bbox"],
                    "disappeared": 0,
                    "max_conf": d["confidence"],
                    "class_name": d.get("class_name", "pothole")
                }
                d["track_id"] = tid
            return detections

        # Compute IoU cost matrix
        active_tids = list(self.tracks.keys())
        active_boxes = [self.tracks[tid]["bbox"] for tid in active_tids]

        det_boxes = [d["bbox"] for d in detections]
        iou_matrix = np.zeros((len(active_boxes), len(det_boxes)), dtype=np.float32)

        for i, b_track in enumerate(active_boxes):
            for j, b_det in enumerate(det_boxes):
                iou_matrix[i, j] = self._box_iou(b_track, b_det)

        matched_tracks = set()
        matched_dets = set()

        # Greedy match on highest IoU
        while True:
            if iou_matrix.size == 0:
                break
            max_val = np.max(iou_matrix)
            if max_val < self.iou_thresh:
                break
            i, j = np.unravel_index(np.argmax(iou_matrix), iou_matrix.shape)
            tid = active_tids[i]
            detections[j]["track_id"] = tid
            self.tracks[tid]["bbox"] = detections[j]["bbox"]
            self.tracks[tid]["disappeared"] = 0
            self.tracks[tid]["max_conf"] = max(self.tracks[tid]["max_conf"], detections[j]["confidence"])
            matched_tracks.add(tid)
            matched_dets.add(j)
            iou_matrix[i, :] = -1
            iou_matrix[:, j] = -1

        # Unmatched tracks increment disappeared
        for tid in active_tids:
            if tid not in matched_tracks:
                self.tracks[tid]["disappeared"] += 1
                if self.tracks[tid]["disappeared"] > self.max_disappeared:
                    self.completed_tracks.append(self.tracks[tid])
                    del self.tracks[tid]

        # Unmatched detections become new tracks
        for j, d in enumerate(detections):
            if j not in matched_dets:
                tid = self.next_track_id
                self.next_track_id += 1
                self.tracks[tid] = {
                    "track_id": tid,
                    "bbox": d["bbox"],
                    "disappeared": 0,
                    "max_conf": d["confidence"],
                    "class_name": d.get("class_name", "pothole")
                }
                d["track_id"] = tid

        return detections

    def _box_iou(self, b1, b2):
        x1 = max(b1[0], b2[0])
        y1 = max(b1[1], b2[1])
        x2 = min(b1[2], b2[2])
        y2 = min(b1[3], b2[3])
        inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
        a1 = max(1.0, (b1[2] - b1[0]) * (b1[3] - b1[1]))
        a2 = max(1.0, (b2[2] - b2[0]) * (b2[3] - b2[1]))
        union = a1 + a2 - inter
        iou = inter / union if union > 0 else 0.0

        # Generalized spatial proximity fallback for vehicle approach velocity
        c1x, c1y = (b1[0] + b1[2]) / 2.0, (b1[1] + b1[3]) / 2.0
        c2x, c2y = (b2[0] + b2[2]) / 2.0, (b2[1] + b2[3]) / 2.0
        diag = max(20.0, float(np.hypot(b1[2] - b1[0], b1[3] - b1[1])))
        dist = float(np.hypot(c1x - c2x, c1y - c2y))

        if iou < 0.20 and dist < (diag * 1.2):
            # Proximity score based on normalized center distance
            prox_score = max(0.20, 1.0 - (dist / (diag * 1.5)))
            return max(iou, prox_score)

        return iou

    def get_total_unique_potholes(self) -> int:
        return self.next_track_id - 1

class VideoService:
    def __init__(self):
        model_path = str(settings.BASE_DIR / settings.MODEL_PATH)
        seg_path = str(settings.BASE_DIR / settings.SEGMENTER_PATH)
        self.detector = YOLODetector(model_path, device=settings.DEVICE)
        self.segmenter = YOLOSegmenter(seg_path, device=settings.DEVICE)
        self.depth_model = MonocularDepthModel()
        self.output_dir = settings.get_output_path()

    def process_video(
        self,
        video_path: Path,
        analysis_id: str,
        original_filename: str,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        frame_sample_rate: int = 2 # Process every Nth frame for performance
    ) -> Dict[str, Any]:
        """
        Executes end-to-end video inspection with multi-object tracking.
        """
        start_time = time.time()
        logger.info("Starting video inspection", analysis_id=analysis_id, filename=original_filename)

        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise ValueError(f"Unable to open video at {video_path}")

        orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = float(cap.get(cv2.CAP_PROP_FPS))
        if fps <= 0 or np.isnan(fps):
            fps = 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = total_frames / fps if fps > 0 else 0.0

        # Video writer for annotated output
        out_video_name = f"{analysis_id}_processed.mp4"
        out_video_path = self.output_dir / out_video_name
        fourcc = cv2.VideoWriter_fourcc(*"avc1")
        writer = cv2.VideoWriter(str(out_video_path), fourcc, fps / frame_sample_rate, (orig_w, orig_h))
        if not writer.isOpened():
            # Fallback codec
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            writer = cv2.VideoWriter(str(out_video_path), fourcc, fps / frame_sample_rate, (orig_w, orig_h))

        tracker = PotholeTracker(iou_thresh=iou_threshold)
        unique_pothole_records = {} # track_id -> consolidated pothole info
        frame_idx = 0
        processed_frames = 0
        keyframe_bgr = None

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % frame_sample_rate == 0:
                processed_frames += 1
                # Run detection
                dets = self.detector.predict(frame, conf_threshold=conf_threshold, iou_threshold=iou_threshold)
                boxes = [d["bbox"] for d in dets]
                
                # Instance segmentation
                segs = self.segmenter.segment(frame, boxes=boxes, conf_threshold=conf_threshold, iou_threshold=iou_threshold)
                
                # Track detections across frames
                tracked_segs = tracker.update(segs)

                # Format frame annotations
                frame_potholes = []
                for s in tracked_segs:
                    tid = s.get("track_id", 1)
                    poly_np = np.array(s["polygon"])
                    
                    # Compute measurements
                    m = measurement_service.compute_pothole_measurements(
                        polygon_pts=poly_np,
                        bbox=s["bbox"],
                        image_dims=(orig_w, orig_h)
                    )
                    
                    # Depth & severity
                    depth_map = self.depth_model.predict_depth_map(frame)
                    depth_res = self.depth_model.analyze_pothole_depth(depth_map, poly_np, (orig_w, orig_h))
                    
                    sev_res = severity_service.assess_pothole_severity(
                        measurement=m,
                        relative_depth_index=depth_res["relative_depth_index"],
                        confidence=s["confidence"],
                        image_dims=(orig_w, orig_h)
                    )

                    p_item = {
                        "analysis_id": analysis_id,
                        "pothole_id": tid,
                        "confidence": s["confidence"],
                        "bbox": s["bbox"],
                        "polygon": s["polygon"],
                        "area_pixels": m["area_pixels"],
                        "perimeter_pixels": m["perimeter_pixels"],
                        "width_pixels": m["width_pixels"],
                        "length_pixels": m["length_pixels"],
                        "aspect_ratio": m["aspect_ratio"],
                        "circularity": m["circularity"],
                        "centroid": m["centroid"],
                        "bounding_box_area": m["bounding_box_area"],
                        "mask_area_ratio": m["mask_area_ratio"],
                        "road_area_ratio_pct": m["road_area_ratio_pct"],
                        "is_calibrated": False,
                        "display_area": m["display_area"],
                        "display_width": m["display_width"],
                        "display_length": m["display_length"],
                        "display_depth": depth_res["display_depth"],
                        "depth_status": depth_res["depth_status"],
                        "relative_depth_index": depth_res["relative_depth_index"],
                        "severity": sev_res["severity"],
                        "risk_level": sev_res["risk_level"],
                        "severity_score": sev_res["severity_score"],
                        "possible_factors": ["Pavement wear under dynamic traffic loading"],
                        "recommendations": [sev_res["urgency"]],
                        "explainability": sev_res["explainability"]
                    }
                    frame_potholes.append(p_item)

                    # Update persistent unique record
                    if tid not in unique_pothole_records or s["confidence"] > unique_pothole_records[tid]["confidence"]:
                        unique_pothole_records[tid] = p_item

                # Render annotated frame
                annotated_frame = render_combined_overlay(frame, frame_potholes)
                # Overlay Frame & Track Stats HUD
                hud_text = f"Frame {frame_idx}/{total_frames} | Unique Potholes Tracked: {tracker.get_total_unique_potholes()}"
                cv2.putText(annotated_frame, hud_text, (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2, cv2.LINE_AA)
                writer.write(annotated_frame)

                if keyframe_bgr is None and frame_potholes:
                    keyframe_bgr = annotated_frame.copy()

            frame_idx += 1

        cap.release()
        writer.release()

        # Save keyframe screenshot
        keyframe_name = f"{analysis_id}_keyframe.jpg"
        keyframe_path = self.output_dir / keyframe_name
        if keyframe_bgr is None:
            # Create thumbnail from first frame
            cap_thumb = cv2.VideoCapture(str(video_path))
            ret, first_frame = cap_thumb.read()
            cap_thumb.release()
            if ret:
                cv2.imwrite(str(keyframe_path), first_frame)
        else:
            cv2.imwrite(str(keyframe_path), keyframe_bgr)

        # Consolidate overall unique potholes
        consolidated_potholes = list(unique_pothole_records.values())
        total_unique = len(consolidated_potholes)

        overall_cond, cond_src, sev_breakdown = severity_service.calculate_overall_road_condition(
            consolidated_potholes, (orig_w, orig_h)
        )
        recs = recommendation_service.generate_recommendations(consolidated_potholes, overall_cond)

        avg_conf = (
            float(np.mean([p["confidence"] for p in consolidated_potholes]))
            if consolidated_potholes else 0.0
        )
        processing_ms = round((time.time() - start_time) * 1000.0, 1)

        summary_doc = {
            "analysis_id": analysis_id,
            "file_name": original_filename,
            "file_type": "video",
            "model_version": self.detector.version,
            "created_at": datetime.now().astimezone().isoformat(),
            "processing_time_ms": processing_ms,
            "original_media_url": f"/api/v1/media/uploads/{video_path.name}",
            "annotated_media_url": f"/api/v1/media/processed/{out_video_name}",
            "detection_media_url": f"/api/v1/media/processed/{keyframe_name}",
            "report_pdf_url": f"/api/v1/analysis/{analysis_id}/report.pdf",
            "annotated_media_path": str(keyframe_path),
            "media_dimensions": [orig_w, orig_h],
            "frame_count": total_frames,
            "fps": round(fps, 2),
            "duration_seconds": round(duration_sec, 2),
            "pothole_count": total_unique,
            "overall_condition": overall_cond,
            "road_condition_source": cond_src,
            "severity_breakdown": sev_breakdown,
            "average_confidence": round(avg_conf, 4),
            "potholes": consolidated_potholes,
            "recommendations": recs.model_dump(),
            "tracking_metadata": {
                "algorithm": "ByteTrack-Compatible IoU Association",
                "total_unique_potholes": total_unique,
                "processed_frames": processed_frames,
                "sampling_stride": frame_sample_rate
            }
        }

        # Generate PDF report for video summary
        try:
            report_service.generate_pdf_report(summary_doc)
        except Exception as e:
            logger.error("Failed to generate video PDF report", error=str(e), analysis_id=analysis_id)

        logger.info(
            "Video inspection complete",
            analysis_id=analysis_id,
            unique_potholes=total_unique,
            frames=total_frames,
            duration=round(duration_sec, 1)
        )
        return summary_doc

video_service = VideoService()
