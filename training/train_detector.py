"""
AI-PAVE Detector Training Script
Trains YOLOv8 detection model on normalized pavement damage dataset.
Enforces checkpointing, reproducibility logs, software version capture,
and outputs standardized model artifacts.
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

def train_detector(config_path: str = "training/config.yaml"):
    with open(config_path, "r") as f:
        cfg = yaml.safe_load(f)

    # Determine execution device
    device = cfg["training"]["device"]
    if device == "auto":
        device = 0 if torch.cuda.is_available() else "cpu"

    print(f"Starting AI-PAVE Detector Training on device: {device}")
    print(f"PyTorch version: {torch.__version__}, Ultralytics: {ultralytics.__version__}")

    # Initialize model
    model_name = cfg["model"].get("type", "yolov8n.pt")
    model = YOLO(model_name)

    # Resolve dataset yaml path
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
        name="detector_run",
        exist_ok=True,
        verbose=True
    )
    duration_sec = time.time() - start_time

    # Find best and last checkpoints
    run_dir = artifacts_dir / "runs" / "detector_run"
    weights_dir = run_dir / "weights"
    best_pt = weights_dir / "best.pt"
    last_pt = weights_dir / "last.pt"

    dest_best = artifacts_dir / "pothole_detector_yolo.pt"
    if best_pt.exists():
        shutil.copy2(best_pt, dest_best)
    elif last_pt.exists():
        shutil.copy2(last_pt, dest_best)
    else:
        # Save model directly
        model.save(str(dest_best))

    # Compile reproducibility metadata
    metadata = {
        "model_name": "AI-PAVE YOLOv8 Pothole Detector",
        "model_version": "v8n-rdd2022-v1",
        "task": "detect",
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
            "mAP50": getattr(results, "results_dict", {}).get("metrics/mAP50(B)", 0.0),
            "mAP50_95": getattr(results, "results_dict", {}).get("metrics/mAP50-95(B)", 0.0),
            "precision": getattr(results, "results_dict", {}).get("metrics/precision(B)", 0.0),
            "recall": getattr(results, "results_dict", {}).get("metrics/recall(B)", 0.0)
        }
    }

    with open(artifacts_dir / "detector_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    with open(artifacts_dir / "training_config.json", "w") as f:
        json.dump(cfg, f, indent=2)

    print(f"Training completed in {duration_sec:.1f}s. Saved to {dest_best}")
    return metadata

if __name__ == "__main__":
    train_detector()
