"""
AI-PAVE Unified Detection & Analysis Orchestrator
Coordinates detector, segmenter, depth engine, measurements, severity,
factors, recommendations, visual overlays, and report generation for images.
"""

import time
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import cv2
import numpy as np

from app.core.config import settings
from app.core.logging import logger
from app.ml.detector import YOLODetector
from app.ml.segmenter import YOLOSegmenter
from app.ml.depth_model import MonocularDepthModel
from app.ml.postprocessing import (
    render_detection_overlay,
    render_segmentation_overlay,
    render_depth_colormap,
    render_combined_overlay
)
from app.services.measurement_service import measurement_service
from app.services.severity_service import severity_service
from app.services.recommendation_service import recommendation_service
from app.services.report_service import report_service
from app.services.evaluation_plot_service import evaluation_plot_service

class DetectionService:
    def __init__(self):
        # Initialize ML engines
        model_path = str(settings.BASE_DIR / settings.MODEL_PATH)
        seg_path = str(settings.BASE_DIR / settings.SEGMENTER_PATH)
        
        self.detector = YOLODetector(model_path, device=settings.DEVICE)
        self.segmenter = YOLOSegmenter(seg_path, device=settings.DEVICE)
        self.depth_model = MonocularDepthModel()
        self.output_dir = settings.get_output_path()

    def process_image(
        self,
        image_path: Path,
        analysis_id: str,
        original_filename: str,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        calibration_scale_cm_per_px: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Executes full end-to-end inspection pipeline on a single road image.
        """
        start_time = time.time()
        logger.info("Starting image inspection", analysis_id=analysis_id, filename=original_filename)

        img_bgr = cv2.imread(str(image_path))
        if img_bgr is None:
            raise ValueError(f"Unable to read image at {image_path}")

        h, w = img_bgr.shape[:2]
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        # 1. Monocular relative depth map
        depth_map = self.depth_model.predict_depth_map(img_rgb)

        # 2. Pothole Detection (bounding boxes)
        detections = self.detector.predict(
            img_bgr,
            conf_threshold=conf_threshold,
            iou_threshold=iou_threshold
        )

        boxes = [d["bbox"] for d in detections]

        # 3. Instance Segmentation (polygons, perimeter, contour analysis)
        segmentations = self.segmenter.segment(
            img_bgr,
            boxes=boxes,
            conf_threshold=conf_threshold,
            iou_threshold=iou_threshold
        )

        # 4. Integrate geometric measurements, depth, severity, and factors
        potholes_data = []
        for idx, seg in enumerate(segmentations):
            p_id = idx + 1
            bbox = seg["bbox"]
            poly = seg["polygon"]
            conf = seg["confidence"]

            # Geometric analysis
            poly_np = np.array(poly)
            measurements = measurement_service.compute_pothole_measurements(
                polygon_pts=poly_np,
                bbox=bbox,
                image_dims=(w, h),
                calibration_scale_cm_per_px=calibration_scale_cm_per_px
            )

            # Local depth analysis inside pothole mask vs surrounding road
            depth_analysis = self.depth_model.analyze_pothole_depth(
                depth_map=depth_map,
                polygon_pts=poly_np,
                img_dims=(w, h),
                calibration_scale_factor=(calibration_scale_cm_per_px / 100.0) if calibration_scale_cm_per_px else None
            )

            # Severity assessment
            rel_depth_idx = depth_analysis["relative_depth_index"]
            sev_assessment = severity_service.assess_pothole_severity(
                measurement=measurements,
                relative_depth_index=rel_depth_idx,
                confidence=conf,
                image_dims=(w, h)
            )

            # Visual surface factors
            factors = severity_service.detect_possible_contributing_factors(
                image_bgr=img_bgr,
                bbox=bbox,
                polygon_pts=poly_np
            )

            pothole_entry = {
                "analysis_id": analysis_id,
                "pothole_id": p_id,
                "confidence": conf,
                "bbox": bbox,
                "polygon": poly,
                "area_pixels": measurements["area_pixels"],
                "perimeter_pixels": measurements["perimeter_pixels"],
                "width_pixels": measurements["width_pixels"],
                "length_pixels": measurements["length_pixels"],
                "aspect_ratio": measurements["aspect_ratio"],
                "circularity": measurements["circularity"],
                "centroid": measurements["centroid"],
                "bounding_box_area": measurements["bounding_box_area"],
                "mask_area_ratio": measurements["mask_area_ratio"],
                "road_area_ratio_pct": measurements["road_area_ratio_pct"],
                "is_calibrated": measurements["is_calibrated"],
                "physical_area_m2": measurements["physical_area_m2"],
                "physical_width_m": measurements["physical_width_m"],
                "physical_length_m": measurements["physical_length_m"],
                "physical_depth_m": depth_analysis["physical_depth_m"],
                "display_area": measurements["display_area"],
                "display_width": measurements["display_width"],
                "display_length": measurements["display_length"],
                "display_depth": depth_analysis["display_depth"],
                "depth_status": depth_analysis["depth_status"],
                "relative_depth_index": depth_analysis["relative_depth_index"],
                "severity": sev_assessment["severity"],
                "risk_level": sev_assessment["risk_level"],
                "severity_score": sev_assessment["severity_score"],
                "possible_factors": factors,
                "recommendations": [sev_assessment["urgency"]],
                "explainability": sev_assessment["explainability"]
            }
            potholes_data.append(pothole_entry)

        # 5. Overall road condition
        overall_condition, condition_source, severity_counts = severity_service.calculate_overall_road_condition(
            potholes=potholes_data,
            image_dims=(w, h)
        )

        # 6. Maintenance & Preventive Recommendations
        maintenance_summary = recommendation_service.generate_recommendations(
            potholes=potholes_data,
            overall_condition=overall_condition
        )

        # 7. Render Visual Media Overlays
        # a. Detection box overlay
        det_img = render_detection_overlay(img_bgr, potholes_data)
        det_filename = f"{analysis_id}_detection.jpg"
        det_path = self.output_dir / det_filename
        cv2.imwrite(str(det_path), det_img)

        # b. Segmentation overlay
        seg_img = render_segmentation_overlay(img_bgr, potholes_data)
        seg_filename = f"{analysis_id}_segmentation.jpg"
        seg_path = self.output_dir / seg_filename
        cv2.imwrite(str(seg_path), seg_img)

        # c. Depth colormap
        depth_color = render_depth_colormap(depth_map)
        depth_filename = f"{analysis_id}_depth.jpg"
        depth_path = self.output_dir / depth_filename
        cv2.imwrite(str(depth_path), depth_color)

        # d. Combined inspection overlay (Primary Annotated)
        comb_img = render_combined_overlay(img_bgr, potholes_data)
        comb_filename = f"{analysis_id}_annotated.jpg"
        comb_path = self.output_dir / comb_filename
        cv2.imwrite(str(comb_path), comb_img)

        processing_ms = round((time.time() - start_time) * 1000.0, 1)
        avg_conf = (
            float(np.mean([p["confidence"] for p in potholes_data]))
            if potholes_data else 0.0
        )

        # 8. Build complete document
        doc = {
            "analysis_id": analysis_id,
            "file_name": original_filename,
            "file_type": "image",
            "model_version": self.detector.version,
            "created_at": datetime.now().astimezone().isoformat(),
            "processing_time_ms": processing_ms,
            "original_media_url": f"/api/v1/media/uploads/{image_path.name}",
            "annotated_media_url": f"/api/v1/media/processed/{comb_filename}",
            "detection_media_url": f"/api/v1/media/processed/{det_filename}",
            "segmentation_media_url": f"/api/v1/media/processed/{seg_filename}",
            "depth_media_url": f"/api/v1/media/processed/{depth_filename}",
            "report_pdf_url": f"/api/v1/analysis/{analysis_id}/report.pdf",
            "annotated_media_path": str(comb_path),
            "media_dimensions": [w, h],
            "pothole_count": len(potholes_data),
            "overall_condition": overall_condition,
            "road_condition_source": condition_source,
            "severity_breakdown": severity_counts,
            "average_confidence": round(avg_conf, 4),
            "potholes": potholes_data,
            "recommendations": maintenance_summary.model_dump(),
            "calibration": {
                "is_calibrated": calibration_scale_cm_per_px is not None and calibration_scale_cm_per_px > 0,
                "pixel_scale_factor": calibration_scale_cm_per_px
            }
        }

        # 9. Generate ML evaluation metrics and sklearn diagnostic plots
        try:
            doc["evaluation"] = evaluation_plot_service.generate_evaluation_for_analysis(doc)
        except Exception as e:
            logger.error("Failed to generate image evaluation", error=str(e), analysis_id=analysis_id)
            doc["evaluation"] = None

        # 10. Generate PDF report
        try:
            report_service.generate_pdf_report(doc)
        except Exception as e:
            logger.error("Failed to generate PDF report", error=str(e), analysis_id=analysis_id)

        logger.info(
            "Image inspection complete",
            analysis_id=analysis_id,
            potholes=len(potholes_data),
            processing_time_ms=processing_ms
        )
        return doc

detection_service = DetectionService()
