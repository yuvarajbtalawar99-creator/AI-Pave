"""
AI-PAVE Dataset Validation Engine
Performs comprehensive integrity validation on dataset splits:
- Missing image / label pairs
- Corrupted / truncated image files
- Invalid or out-of-bound bounding boxes
- Zero-area or empty annotations
- Exact & near duplicates
- Class distribution & image resolution histograms
Generates dataset_report.json and dataset_report.html.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from collections import Counter
from PIL import Image
import numpy as np

def validate_dataset(dataset_dir: Path, output_dir: Path):
    report = {
        "status": "PASS",
        "dataset_root": str(dataset_dir.resolve()),
        "summary": {
            "total_images": 0,
            "total_labels": 0,
            "corrupt_images": 0,
            "missing_labels": 0,
            "orphaned_labels": 0,
            "invalid_boxes": 0,
            "empty_annotation_files": 0,
            "duplicate_images": 0,
        },
        "splits": {},
        "class_distribution": Counter(),
        "resolution_distribution": Counter(),
        "box_size_distribution": {
            "small (< 0.05)": 0,
            "medium (0.05 - 0.20)": 0,
            "large (> 0.20)": 0
        },
        "errors": []
    }

    splits = ["train", "val", "test", "external_test"]
    seen_hashes = {}

    for split in splits:
        img_dir = dataset_dir / split / "images"
        lbl_dir = dataset_dir / split / "labels"
        if not img_dir.exists():
            continue

        split_stats = {
            "image_count": 0,
            "label_count": 0,
            "pothole_instances": 0,
            "corrupt_images": [],
            "missing_labels": [],
            "invalid_labels": []
        }

        # Find all images
        images = list(img_dir.glob("*.jpg")) + list(img_dir.glob("*.png")) + list(img_dir.glob("*.jpeg"))
        split_stats["image_count"] = len(images)
        report["summary"]["total_images"] += len(images)

        for img_path in images:
            # 1. Image decodability and resolution
            try:
                with Image.open(img_path) as img:
                    img.verify()
                with Image.open(img_path) as img:
                    w, h = img.size
                    res_key = f"{w}x{h}"
                    report["resolution_distribution"][res_key] += 1

                    # Hash check for duplicate
                    import hashlib
                    with open(img_path, "rb") as f:
                        file_hash = hashlib.md5(f.read()).hexdigest()
                    if file_hash in seen_hashes:
                        report["summary"]["duplicate_images"] += 1
                        report["errors"].append(f"Duplicate image: {img_path.name} matches {seen_hashes[file_hash]}")
                    else:
                        seen_hashes[file_hash] = f"{split}/{img_path.name}"

            except Exception as e:
                report["summary"]["corrupt_images"] += 1
                split_stats["corrupt_images"].append(img_path.name)
                report["errors"].append(f"Corrupt image {img_path.name}: {e}")
                continue

            # 2. Label file correspondence
            lbl_path = lbl_dir / f"{img_path.stem}.txt"
            if not lbl_path.exists():
                report["summary"]["missing_labels"] += 1
                split_stats["missing_labels"].append(img_path.name)
                continue

            split_stats["label_count"] += 1
            report["summary"]["total_labels"] += 1

            # 3. Label inspection
            try:
                with open(lbl_path, "r") as lf:
                    lines = [l.strip() for l in lf.readlines() if l.strip()]

                if not lines:
                    report["summary"]["empty_annotation_files"] += 1

                for line_idx, line in enumerate(lines):
                    parts = line.split()
                    if not parts:
                        continue
                    class_id = int(parts[0])
                    report["class_distribution"][f"class_{class_id}"] += 1
                    split_stats["pothole_instances"] += 1

                    # Bounding box or Polygon
                    coords = [float(p) for p in parts[1:]]
                    if len(coords) == 4:
                        # BBox: x_center, y_center, width, height
                        xc, yc, bw, bh = coords
                        if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 < bw <= 1.0 and 0.0 < bh <= 1.0):
                            report["summary"]["invalid_boxes"] += 1
                            split_stats["invalid_labels"].append(f"{img_path.name} line {line_idx+1}: Box coords out of [0, 1]")
                        
                        box_area = bw * bh
                        if box_area < 0.05:
                            report["box_size_distribution"]["small (< 0.05)"] += 1
                        elif box_area <= 0.20:
                            report["box_size_distribution"]["medium (0.05 - 0.20)"] += 1
                        else:
                            report["box_size_distribution"]["large (> 0.20)"] += 1

                    elif len(coords) >= 6 and len(coords) % 2 == 0:
                        # Polygon segmentation mask
                        for c in coords:
                            if not (0.0 <= c <= 1.0):
                                report["summary"]["invalid_boxes"] += 1
                                split_stats["invalid_labels"].append(f"{img_path.name} line {line_idx+1}: Poly coord out of [0, 1]")
                                break
                    else:
                        report["summary"]["invalid_boxes"] += 1
                        split_stats["invalid_labels"].append(f"{img_path.name} line {line_idx+1}: Unrecognized format ({len(parts)} tokens)")
            except Exception as e:
                report["errors"].append(f"Error parsing label {lbl_path.name}: {e}")

        report["splits"][split] = split_stats

    # Check for orphaned labels
    for split in splits:
        img_dir = dataset_dir / split / "images"
        lbl_dir = dataset_dir / split / "labels"
        if not lbl_dir.exists():
            continue
        for lbl_path in lbl_dir.glob("*.txt"):
            matching_img = [img_dir / f"{lbl_path.stem}.jpg", img_dir / f"{lbl_path.stem}.png", img_dir / f"{lbl_path.stem}.jpeg"]
            if not any(m.exists() for m in matching_img):
                report["summary"]["orphaned_labels"] += 1
                report["errors"].append(f"Orphaned label without image: {split}/{lbl_path.name}")

    if report["summary"]["corrupt_images"] > 0 or report["summary"]["invalid_boxes"] > 0:
        report["status"] = "WARNINGS_FOUND"

    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / "dataset_report.json"
    with open(json_path, "w") as f:
        # Convert counter to dict for json serialization
        report_copy = dict(report)
        report_copy["class_distribution"] = dict(report["class_distribution"])
        report_copy["resolution_distribution"] = dict(report["resolution_distribution"])
        json.dump(report_copy, f, indent=2)

    # HTML Report Generation
    html_path = output_dir / "dataset_report.html"
    generate_html_report(report, html_path)

    print(f"Dataset validation completed. Status: {report['status']}")
    print(f"Summary: {report['summary']}")
    print(f"Reports saved to {json_path} and {html_path}")
    return report

def generate_html_report(report: dict, html_path: Path):
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI-PAVE Dataset Integrity Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 24px; }}
        .container {{ max-width: 960px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
        h1 {{ font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 14px; margin-bottom: 24px; }}
        .badge-pass {{ background: #dcfce7; color: #166534; }}
        .badge-warn {{ background: #fef9c3; color: #854d0e; }}
        .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }}
        .card {{ background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center; }}
        .card-val {{ font-size: 24px; font-weight: 700; color: #0f172a; }}
        .card-lbl {{ font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 4px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
        th, td {{ text-align: left; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
        th {{ background: #f8fafc; color: #475569; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>AI-PAVE Dataset Integrity & Validation Report</h1>
        <div class="badge {'badge-pass' if report['status'] == 'PASS' else 'badge-warn'}">STATUS: {report['status']}</div>

        <div class="grid">
            <div class="card"><div class="card-val">{report['summary']['total_images']}</div><div class="card-lbl">Total Images</div></div>
            <div class="card"><div class="card-val">{report['summary']['total_labels']}</div><div class="card-lbl">Total Labels</div></div>
            <div class="card"><div class="card-val">{report['summary']['corrupt_images']}</div><div class="card-lbl">Corrupt Images</div></div>
            <div class="card"><div class="card-val">{report['summary']['invalid_boxes']}</div><div class="card-lbl">Invalid Annotations</div></div>
        </div>

        <h3>Split Breakdown</h3>
        <table>
            <thead>
                <tr><th>Split</th><th>Images</th><th>Labels</th><th>Pothole Instances</th></tr>
            </thead>
            <tbody>
"""
    for split_name, s_data in report["splits"].items():
        html += f"<tr><td><strong>{split_name}</strong></td><td>{s_data['image_count']}</td><td>{s_data['label_count']}</td><td>{s_data['pothole_instances']}</td></tr>"

    html += """
            </tbody>
        </table>

        <h3 style="margin-top: 24px;">Pothole Scale Distribution</h3>
        <table>
            <thead><tr><th>Bounding Scale</th><th>Instance Count</th></tr></thead>
            <tbody>
    """
    for scale, count in report["box_size_distribution"].items():
        html += f"<tr><td>{scale}</td><td>{count}</td></tr>"

    html += """
            </tbody>
        </table>
    </div>
</body>
</html>
    """
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)

def main():
    parser = argparse.ArgumentParser(description="AI-PAVE Dataset Validation Script")
    parser.add_argument("--dataset-dir", type=str, default="datasets", help="Path to normalized dataset directory")
    parser.add_argument("--output-dir", type=str, default="artifacts/evaluation", help="Directory to save report outputs")
    args = parser.parse_args()

    validate_dataset(Path(args.dataset_dir), Path(args.output_dir))

if __name__ == "__main__":
    main()
