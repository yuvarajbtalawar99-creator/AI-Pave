"""
AI-PAVE Model Export Engine
Supports exporting trained models to ONNX and TorchScript formats for deployment.
"""

import os
import sys
import argparse
from pathlib import Path
from ultralytics import YOLO

def export_model(model_path: str = "artifacts/models/pothole_detector_yolo.pt", format: str = "onnx"):
    p = Path(model_path)
    if not p.exists():
        p = Path("yolov8n.pt")

    print(f"Exporting model {p} to format {format}...")
    model = YOLO(str(p))
    exported_path = model.export(format=format, dynamic=True)
    print(f"Model exported successfully to: {exported_path}")
    return exported_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export AI-PAVE model")
    parser.add_argument("--model", type=str, default="artifacts/models/pothole_detector_yolo.pt")
    parser.add_argument("--format", type=str, default="onnx")
    args = parser.parse_args()
    export_model(args.model, args.format)
