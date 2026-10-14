"""
AI-PAVE Segmenter Training Script
Trains YOLOv8-seg instance segmentation model on polygon pothole annotations.
Enforces checkpointing, reproducibility logs, software version capture,
and outputs standardized model artifacts for mask extraction.
"""

import os
import sys
import yaml
import json
import time
import shutil
from datetime import datetime
from pathlib import Path
import torch
import ultralytics
from ultralytics import YOLO

def train_segmenter(config_path: str = "training/config.yaml"):
    with open(config_path, "r") as f:
        cfg = yaml.safe_load(f)

    device = cfg["training"]["device"]
    if device == "auto":
        device = 0 if torch.cuda.is_available() else "cpu"

    print(f"Starting AI-PAVE Segmenter Training on device: {device}")
    print(f"PyTorch version: {torch.__version__}, Ultralytics: {ultralytics.__version__}")

    model_name = "yolov8n-seg.pt"
    model = YOLO(model_name)

    dataset_yaml = Path("datasets/potholes.yaml").resolve()
    if not dataset_yaml.exists():
        raise FileNotFoundError(f"Dataset config not found at {dataset_yaml}")

    artifacts_dir = Path("artifacts/models")
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    start_time = time.time()
    results = model.train(
        data=str(dataset_yaml),
        epochs=cfg["training"]["epochs"],
        batch=cfg["training"]["batch_size"],
        imgsz=cfg["training"]["imgsz"],
        lr0=cfg["training"]["learning_rate"],
        optimizer=cfg["training"]["optimizer"],
        workers=cfg["training"]["workers"],
        device=device,
        patience=cfg["training"]["patience"],
        seed=cfg["training"]["seed"],
        deterministic=cfg["training"]["deterministic"],
        project=str(artifacts_dir / "runs"),
        name="segmenter_run",
        exist_ok=True,
        verbose=True
    )
    duration_sec = time.time() - start_time

    run_dir = artifacts_dir / "runs" / "segmenter_run"
    weights_dir = run_dir / "weights"
    best_pt = weights_dir / "best.pt"
    last_pt = weights_dir / "last.pt"

    dest_best = artifacts_dir / "pothole_segmenter_yolo.pt"
    if best_pt.exists():
        shutil.copy2(best_pt, dest_best)
    elif last_pt.exists():
        shutil.copy2(last_pt, dest_best)
    else:
        model.save(str(dest_best))

    metadata = {
        "model_name": "AI-PAVE YOLOv8 Pothole Segmenter",
        "model_version": "v8n-seg-pothole-v1",
        "task": "segment",
        "training_timestamp": datetime.now().isoformat(),
        "training_duration_seconds": round(duration_sec, 2),
        "device_used": str(device),
        "software_versions": {
            "python": sys.version,
            "torch": torch.__version__,
            "ultralytics": ultralytics.__version__
        },
        "hyperparameters": cfg["training"],
        "class_names": {0: "pothole"},
        "checkpoint_path": str(dest_best.resolve()),
        "metrics_summary": {
            "box_mAP50": getattr(results, "results_dict", {}).get("metrics/mAP50(B)", 0.0),
            "mask_mAP50": getattr(results, "results_dict", {}).get("metrics/mAP50(M)", 0.0),
            "mask_precision": getattr(results, "results_dict", {}).get("metrics/precision(M)", 0.0),
            "mask_recall": getattr(results, "results_dict", {}).get("metrics/recall(M)", 0.0)
        }
    }

    with open(artifacts_dir / "segmenter_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Segmentation Training completed in {duration_sec:.1f}s. Saved to {dest_best}")
    return metadata

if __name__ == "__main__":
    train_segmenter()
