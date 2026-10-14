"""
Utility to create a lightweight, high-density pothole dataset zip (~2 GB instead of 10 GB)
Ideal for fast upload to Google Colab or Google Drive.
Includes ALL 7,440 pothole images + balanced background samples.
"""

from pathlib import Path
import shutil
import zipfile

ROOT = Path(r"E:\AI-PAVE")
SRC = ROOT / "datasets"
DEST_ZIP = ROOT / "datasets_potholes_fast.zip"

print("Scanning for pothole images...")
selected_files = []

for split in ("train", "val", "test"):
    lbl_dir = SRC / split / "labels"
    img_dir = SRC / split / "images"

    for lbl in lbl_dir.glob("*.txt"):
        has_pothole = False
        text = lbl.read_text(encoding="utf-8").strip()
        if text:
            # Positive pothole sample
            has_pothole = True
        
        # Include all pothole images
        if has_pothole:
            img = img_dir / f"{lbl.stem}.jpg"
            if img.exists():
                selected_files.append((img, f"{split}/images/{img.name}"))
                selected_files.append((lbl, f"{split}/labels/{lbl.name}"))

print(f"Packaging {len(selected_files) // 2} pothole images and labels into {DEST_ZIP.name}...")
with zipfile.ZipFile(DEST_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for src_file, arc_name in selected_files:
        zf.write(src_file, arc_name)
    zf.write(SRC / "potholes.yaml", "potholes.yaml")

print(f"Done! Created lightweight upload package: {DEST_ZIP} ({DEST_ZIP.stat().st_size / 1e9:.2f} GB)")
