"""
AI-PAVE Model Validation Script
Runs validation split evaluation against checkpointed models.
"""

import os
import sys
import yaml
import json
from pathlib import Path
from ultralytics import YOLO

def run_validation(model_path: str = "artifacts/models/pothole_detector_yolo.pt",
                   dataset_path: str = "datasets/potholes.yaml"):
    p_model = Path(model_path)
    if not p_model.exists():
        # Fallback to base pretrained
        p_model = Path("yolov8n.pt")

    model = YOLO(str(p_model))
    metrics = model.val(data=dataset_path, split="val")
    
    val_summary = {
        "model": str(p_model.name),
        "split": "val",
        "precision": float(metrics.results_dict.get("metrics/precision(B)", 0.0)),
        "recall": float(metrics.results_dict.get("metrics/recall(B)", 0.0)),
        "mAP50": float(metrics.results_dict.get("metrics/mAP50(B)", 0.0)),
        "mAP50_95": float(metrics.results_dict.get("metrics/mAP50-95(B)", 0.0))
    }
    print(f"Validation Results: {val_summary}")
    return val_summary

if __name__ == "__main__":
    run_validation()
