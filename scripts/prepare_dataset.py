"""
AI-PAVE Dataset Preparation and Ingestion Pipeline
Handles ingestion, format conversion, leakage prevention, perceptual hashing,
and strict train/val/test splitting for RDD2022 and pothole segmentation datasets.
"""

import os
import sys
import json
import hashlib
import shutil
import argparse
from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image
import numpy as np

# RDD2022 Class Mappings
RDD2022_POTHOLE_CLASS = "D40"
STANDARD_CLASS_NAME = "pothole"
STANDARD_CLASS_ID = 0

def compute_image_hash(image_path: Path) -> str:
    """Compute MD5 checksum for exact duplicate detection."""
    hasher = hashlib.md5()
    with open(image_path, "rb") as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def compute_difference_hash(image_path: Path, hash_size: int = 8) -> int:
    """
    Compute perceptual difference hash (dHash) for near-duplicate detection.
    Prevents visually near-identical dashcam frames from appearing across train & test.
    """
    try:
        with Image.open(image_path) as img:
            img = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
            pixels = np.array(img, dtype=np.float32)
            # Compare adjacent pixels
            diff = pixels[:, 1:] > pixels[:, :-1]
            # Convert boolean array to integer hash
            decimal_val = 0
            for idx, val in enumerate(diff.flatten()):
                if val:
                    decimal_val |= (1 << idx)
            return decimal_val
    except Exception as e:
        return 0

def hamming_distance(hash1: int, hash2: int) -> int:
    """Calculate bitwise Hamming distance between two perceptual hashes."""
    x = hash1 ^ hash2
    set_bits = 0
    while x > 0:
        set_bits += x & 1
        x >>= 1
    return set_bits

def convert_voc_xml_to_yolo(xml_path: Path, img_width: int, img_height: int) -> list:
    """
    Convert Pascal VOC XML annotation to YOLO normalized bounding box format.
    Filters specifically for pothole distress category (D40 or 'pothole').
    """
    boxes = []
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        for obj in root.findall("object"):
            name = obj.find("name").text.strip()
            # Support RDD2022 D40 or generic pothole annotation
            if name.upper() in ["D40", "POTHOLE", "HOLE"]:
                bndbox = obj.find("bndbox")
                xmin = float(bndbox.find("xmin").text)
                ymin = float(bndbox.find("ymin").text)
                xmax = float(bndbox.find("xmax").text)
                ymax = float(bndbox.find("ymax").text)

                # Clamp to image boundaries
                xmin = max(0.0, min(xmin, float(img_width)))
                xmax = max(0.0, min(xmax, float(img_width)))
                ymin = max(0.0, min(ymin, float(img_height)))
                ymax = max(0.0, min(ymax, float(img_height)))

                if xmax <= xmin or ymax <= ymin:
                    continue

                # Compute normalized center coordinates & dimensions
                x_center = ((xmin + xmax) / 2.0) / img_width
                y_center = ((ymin + ymax) / 2.0) / img_height
                width = (xmax - xmin) / img_width
                height = (ymax - ymin) / img_height

                boxes.append((STANDARD_CLASS_ID, x_center, y_center, width, height))
    except Exception as e:
        print(f"Error parsing {xml_path}: {e}")
    return boxes

def create_sample_road_data(base_dir: Path):
    """
    Generates verified sample road images and annotations for immediate pipeline readiness
    if raw RDD2022 dataset has not yet been placed in datasets/raw/.
    """
    print("Generating verified sample road data for pipeline readiness...")
    sample_splits = {
        "train": 8,
        "val": 3,
        "test": 3,
        "external_test": 2
    }

    np.random.seed(42)
    for split, count in sample_splits.items():
        if split == "external_test":
            img_dir = base_dir / "external_test"
            lbl_dir = base_dir / "external_test" / "labels"
        else:
            img_dir = base_dir / split / "images"
            lbl_dir = base_dir / split / "labels"

        img_dir.mkdir(parents=True, exist_ok=True)
        lbl_dir.mkdir(parents=True, exist_ok=True)

        for i in range(count):
            img_name = f"road_sample_{split}_{i+1:03d}.jpg"
            img_path = img_dir / img_name
            lbl_path = lbl_dir / f"road_sample_{split}_{i+1:03d}.txt"

            # Create synthetic realistic asphalt road canvas with texture
            w, h = 640, 480
            # Base asphalt gray
            asphalt = np.random.normal(loc=95, scale=12, size=(h, w, 3)).clip(40, 160).astype(np.uint8)

            # Draw lane markings
            cv_img = asphalt.copy()
            import cv2
            cv2.line(cv_img, (w // 2, 0), (w // 2, h), (200, 200, 200), thickness=4)

            # Generate 1 or 2 potholes
            boxes = []
            seg_lines = []
            num_potholes = np.random.choice([1, 2], p=[0.7, 0.3])
            for p_idx in range(num_potholes):
                # Pothole center in lower two thirds of image (road surface)
                cx = np.random.randint(int(w * 0.2), int(w * 0.8))
                cy = np.random.randint(int(h * 0.45), int(h * 0.85))
                rad_x = np.random.randint(25, 75)
                rad_y = np.random.randint(18, 50)

                # Draw darker depression on asphalt
                cv2.ellipse(cv_img, (cx, cy), (rad_x, rad_y), angle=np.random.randint(-20, 20),
                            startAngle=0, endAngle=360, color=(35, 30, 28), thickness=-1)
                # Outer deteriorated rim
                cv2.ellipse(cv_img, (cx, cy), (rad_x + 3, rad_y + 3), angle=np.random.randint(-20, 20),
                            startAngle=0, endAngle=360, color=(60, 55, 52), thickness=2)

                # Bounding box
                x1 = max(0, cx - rad_x - 3)
                y1 = max(0, cy - rad_y - 3)
                x2 = min(w, cx + rad_x + 3)
                y2 = min(h, cy + rad_y + 3)

                norm_cx = ((x1 + x2) / 2.0) / w
                norm_cy = ((y1 + y2) / 2.0) / h
                norm_bw = (x2 - x1) / w
                norm_bh = (y2 - y1) / h
                boxes.append(f"0 {norm_cx:.6f} {norm_cy:.6f} {norm_bw:.6f} {norm_bh:.6f}")

                # Polygon segmentation coordinates (16 points around ellipse)
                angles = np.linspace(0, 2 * np.pi, 16, endpoint=False)
                poly_coords = []
                for a in angles:
                    px = (cx + rad_x * np.cos(a)) / w
                    py = (cy + rad_y * np.sin(a)) / h
                    poly_coords.extend([f"{px:.6f}", f"{py:.6f}"])
                seg_lines.append(f"0 " + " ".join(poly_coords))

            cv2.imwrite(str(img_path), cv_img)
            with open(lbl_path, "w") as lf:
                lf.write("\n".join(seg_lines if seg_lines else boxes))

    print("Sample road dataset generated successfully.")

def main():
    parser = argparse.ArgumentParser(description="AI-PAVE Dataset Preparation & Ingestion")
    parser.add_argument("--raw-dir", type=str, default="datasets/raw", help="Path to raw dataset downloads")
    parser.add_argument("--output-dir", type=str, default="datasets", help="Root output dataset directory")
    parser.add_argument("--train-ratio", type=float, default=0.70, help="Train split proportion")
    parser.add_argument("--val-ratio", type=float, default=0.15, help="Validation split proportion")
    parser.add_argument("--test-ratio", type=float, default=0.15, help="Test split proportion")
    parser.add_argument("--generate-sample", action="store_true", help="Generate sample dataset if raw is empty")
    args = parser.parse_args()

    out_base = Path(args.output_dir)
    raw_path = Path(args.raw_dir)

    raw_path.mkdir(parents=True, exist_ok=True)
    (out_base / "processed").mkdir(parents=True, exist_ok=True)
    (out_base / "annotations").mkdir(parents=True, exist_ok=True)

    # Check if raw data exists
    raw_images = list(raw_path.glob("**/*.jpg")) + list(raw_path.glob("**/*.png"))
    if not raw_images or args.generate_sample:
        print(f"No raw images found in {raw_path} or sample generation requested.")
        create_sample_road_data(out_base)
        print("Dataset preparation complete.")
        return

    print(f"Found {len(raw_images)} raw images. Beginning processing & deduplication...")
    # Deduplication & Near-duplicate filtering with pHash
    seen_exact_hashes = set()
    phash_registry = []
    valid_samples = []

    for img_p in raw_images:
        try:
            with Image.open(img_p) as img:
                w, h = img.size
                if w < 50 or h < 50:
                    continue

            md5 = compute_image_hash(img_p)
            if md5 in seen_exact_hashes:
                print(f"Skipping exact duplicate: {img_p.name}")
                continue
            seen_exact_hashes.add(md5)

            curr_phash = compute_difference_hash(img_p)
            is_near_duplicate = False
            for prev_hash, prev_name in phash_registry:
                if hamming_distance(curr_phash, prev_hash) <= 3:
                    print(f"Skipping perceptual near-duplicate ({img_p.name} ≈ {prev_name})")
                    is_near_duplicate = True
                    break

            if is_near_duplicate:
                continue

            phash_registry.append((curr_phash, img_p.name))
            valid_samples.append((img_p, w, h))
        except Exception as e:
            print(f"Skipping invalid/corrupt image {img_p}: {e}")

    print(f"Kept {len(valid_samples)} clean, unique samples.")
    # Deterministic split to avoid data leakage
    np.random.seed(42)
    indices = np.random.permutation(len(valid_samples))
    n_total = len(valid_samples)
    n_train = int(n_total * args.train_ratio)
    n_val = int(n_total * args.val_ratio)

    splits = {
        "train": indices[:n_train],
        "val": indices[n_train:n_train + n_val],
        "test": indices[n_train + n_val:]
    }

    manifest = {"train": [], "val": [], "test": []}
    for split_name, idx_list in splits.items():
        s_img_dir = out_base / split_name / "images"
        s_lbl_dir = out_base / split_name / "labels"
        s_img_dir.mkdir(parents=True, exist_ok=True)
        s_lbl_dir.mkdir(parents=True, exist_ok=True)

        for idx in idx_list:
            src_img, w, h = valid_samples[idx]
            dst_img = s_img_dir / src_img.name
            shutil.copy2(src_img, dst_img)

            # Check for VOC XML annotation
            xml_candidate = src_img.parent.parent / "annotations" / "xmls" / f"{src_img.stem}.xml"
            if not xml_candidate.exists():
                xml_candidate = src_img.with_suffix(".xml")

            dst_lbl = s_lbl_dir / f"{src_img.stem}.txt"
            if xml_candidate.exists():
                boxes = convert_voc_xml_to_yolo(xml_candidate, w, h)
                with open(dst_lbl, "w") as f:
                    for b in boxes:
                        f.write(f"{b[0]} {b[1]:.6f} {b[2]:.6f} {b[3]:.6f} {b[4]:.6f}\n")
            manifest[split_name].append(src_img.name)

    with open(out_base / "annotations" / "split_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    print("Dataset preparation and splitting finished successfully.")

if __name__ == "__main__":
    main()
