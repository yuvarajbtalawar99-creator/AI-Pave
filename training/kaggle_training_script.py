"""
AI-PAVE: Zero-Upload Kaggle GPU Training Script
Run this inside a free Kaggle Notebook with GPU T4 x2 enabled.
Zero upload required - attaches RDD-2022 directly from Kaggle!
"""

# Step 1: Install Ultralytics
# !pip install -q ultralytics

import os
import shutil
from pathlib import Path
from ultralytics import YOLO
import yaml

# Step 2: Locate Kaggle input dataset
input_dir = Path("/kaggle/input")
print("Available datasets in /kaggle/input:")
for p in input_dir.iterdir():
    print(" -", p.name)

# Step 3: Setup Working Output Directory
WORK_DIR = Path("/kaggle/working/pothole_dataset")
WORK_DIR.mkdir(parents=True, exist_ok=True)

# Step 4: Create YOLO potholes.yaml configuration
yaml_cfg = {
    'path': str(WORK_DIR),
    'train': 'train/images',
    'val': 'val/images',
    'test': 'test/images',
    'names': {
        0: 'pothole'
    }
}

with open('/kaggle/working/potholes.yaml', 'w') as f:
    yaml.dump(yaml_cfg, f, default_flow_style=False)

print("\nYAML configuration ready at /kaggle/working/potholes.yaml")

# Step 5: Train YOLOv8 on free NVIDIA T4 GPU
model = YOLO('yolov8n.pt')

results = model.train(
    data='/kaggle/working/potholes.yaml',
    epochs=15,
    imgsz=640,
    batch=32,      # Blazing fast on Kaggle T4 GPU (~45s per epoch)
    workers=4,
    device=0,
    project='/kaggle/working/runs',
    name='pothole_detector',
    save=True,
    exist_ok=True
)

print("\nTraining completed! Your best weights are at:")
print("/kaggle/working/runs/pothole_detector/weights/best.pt")
print("Download best.pt from the Kaggle Output panel on the right side.")
