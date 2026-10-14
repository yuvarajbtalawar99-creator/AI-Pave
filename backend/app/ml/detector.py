"""
AI-PAVE Detector Abstractions and Implementations
Defines BaseDetector interface and YOLODetector wrapper.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple, Optional
from pathlib import Path
import numpy as np
import cv2
import torch
from ultralytics import YOLO

import json
import logging

logger = logging.getLogger("aipave.detector")

class BaseDetector(ABC):
    @abstractmethod
    def load(self, weights_path: str, device: str = "auto") -> None:
        pass

    @abstractmethod
    def predict(
        self,
        image: np.ndarray,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45
    ) -> List[Dict[str, Any]]:
        """
        Runs detection on an RGB/BGR image.
        Returns list of detections with keys:
        - bbox: [x1, y1, x2, y2] in pixels
        - confidence: float
        - class_id: int
        - class_name: str
        """
        pass

class YOLODetector(BaseDetector):
    def __init__(self, weights_path: Optional[str] = None, device: str = "auto"):
        self.model = None
        self.device = device
        self.weights_path = weights_path
        self.version = self._resolve_model_version(weights_path)
        if weights_path:
            self.load(weights_path, device)

    def _resolve_model_version(self, weights_path: Optional[str]) -> str:
        """Resolve model version from metadata artifact if present, else fallback."""
        if weights_path:
            meta_path = Path(weights_path).parent / "detector_metadata.json"
            if meta_path.exists():
                try:
                    with open(meta_path, "r") as f:
                        data = json.load(f)
                        return data.get("model_version", "v8n-rdd2022-gpu-trained")
                except Exception:
                    pass
        return "v8n-rdd2022-gpu-trained"

    def load(self, weights_path: str, device: str = "auto") -> None:
        p = Path(weights_path)
        if not p.exists():
            raise FileNotFoundError(f"Configured model checkpoint not found at: {weights_path}")
        self.weights_path = str(p)
        self.version = self._resolve_model_version(self.weights_path)
        self.model = YOLO(str(p))
        if device != "auto":
            self.device = device
        else:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Loaded YOLO detector from {self.weights_path} (version: {self.version}) on device {self.device}")

    def predict(
        self,
        image: np.ndarray,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45
    ) -> List[Dict[str, Any]]:
        if self.model is None:
            raise RuntimeError("Model is not loaded. Call load() first.")

        h, w = image.shape[:2]
        max_dim = max(h, w)

        # Adaptive Multi-Scale Strategy:
        # Fixed 640px causes severe upsampling blur on low-res thumbnails (<384px),
        # destroying edge and texture gradients of potholes.
        # Adaptive scales match neural receptive fields to native image features.
        if max_dim <= 384:
            scales = [320, 416]
        elif max_dim <= 512:
            scales = [416, 512, 640]
        else:
            scales = [640, 480]

        all_boxes = []
        all_confs = []
        all_classes = []

        for s in scales:
            try:
                results = self.model.predict(
                    source=image,
                    conf=max(0.01, conf_threshold * 0.8), # Allow near-threshold candidates for NMS
                    iou=iou_threshold,
                    imgsz=s,
                    device=self.device,
                    verbose=False
                )
                for r in results:
                    if r.boxes is None or len(r.boxes) == 0:
                        continue
                    for b in r.boxes:
                        coords = b.xyxy[0].cpu().numpy().tolist()
                        conf = float(b.conf[0].cpu().numpy())
                        cls_id = int(b.cls[0].cpu().numpy())
                        all_boxes.append(coords)
                        all_confs.append(conf)
                        all_classes.append(cls_id)
            except Exception as e:
                logger.warning(f"Inference error at scale {s}: {e}")

        # If multiple scales produced detections, fuse via Non-Maximum Suppression (NMS)
        detections = []
        if all_boxes:
            cv_boxes = [[int(x[0]), int(x[1]), max(1, int(x[2] - x[0])), max(1, int(x[3] - x[1]))] for x in all_boxes]
            indices = cv2.dnn.NMSBoxes(cv_boxes, all_confs, score_threshold=conf_threshold, nms_threshold=iou_threshold)
            
            if len(indices) > 0:
                for item in indices:
                    idx = int(item[0]) if hasattr(item, "__len__") else int(item)
                    coords = all_boxes[idx]
                    conf = all_confs[idx]
                    cls_id = all_classes[idx]
                    cls_name = self.model.names.get(cls_id, "pothole") if self.model else "pothole"

                    # Clamp coordinates to image boundaries
                    x1 = max(0.0, min(float(coords[0]), float(w)))
                    y1 = max(0.0, min(float(coords[1]), float(h)))
                    x2 = max(0.0, min(float(coords[2]), float(w)))
                    y2 = max(0.0, min(float(coords[3]), float(h)))

                    if x2 > x1 and y2 > y1 and conf >= conf_threshold:
                        detections.append({
                            "bbox": [round(x1, 2), round(y1, 2), round(x2, 2), round(y2, 2)],
                            "confidence": round(conf, 4),
                            "class_id": cls_id,
                            "class_name": cls_name
                        })

        logger.info(
            f"Inference complete: image={w}x{h}, scales={scales}, "
            f"raw_candidates={len(all_boxes)}, final_detections={len(detections)}"
        )
        return detections
