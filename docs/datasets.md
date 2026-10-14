# AI-PAVE Dataset Documentation

This document describes the road inspection and pavement damage datasets supported by AI-PAVE, with explicit focus on the **RDD2022 (Road Damage Dataset 2022)**.

---

## 1. Primary Dataset: RDD2022 (Road Damage Dataset 2022)

- **Source**: Crowdsensing-based Road Damage Detection Challenge (CRDDC 2022)
- **Kaggle Link**: [RDD-2022 on Kaggle](https://www.kaggle.com/datasets/aliabdelmenam/rdd-2022)
- **License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Geographic Coverage**: Multi-national (Japan, India, Czech Republic, Norway, United States, China)
- **Modality**: Vehicle dashboard-mounted smartphone camera RGB images
- **Resolution**: Typically 600x600 to 1920x1080 (varies by country acquisition device)

### Class Mapping & Standardization

RDD2022 uses standard distress classification codes:
| Original Label | Distress Category | Description | AI-PAVE Handling |
| :--- | :--- | :--- | :--- |
| **D40** | **Pothole** | Bowl-shaped depression in pavement surface | **Target Class (`pothole`)** |
| **D00** | Longitudinal Crack | Wheel-path crack along traffic direction | Secondary distress indicator |
| **D10** | Transverse Crack | Crack perpendicular to pavement centerline | Secondary distress indicator |
| **D20** | Alligator Crack | Interconnected polygonal cracks (fatigue failure) | Secondary distress indicator |
| **Repair / Patch** | Pavement Patch | Previously filled or patched area | Surface condition factor |

### Train / Validation / Test Splitting

To strictly eliminate **data leakage** across frames captured in temporal succession from moving vehicles:
1. **Sequence/Country grouping**: Adjacent sequential dashcam frames are assigned to the *same* split (Train, Val, or Test), never split across them.
2. **Perceptual Hashing (pHash)**: Hamming distance threshold < 6 flags potential duplicate/near-duplicate frames.
3. **Split Proportions**:
   - **Train**: 70%
   - **Validation**: 15%
   - **Test**: 15% (Held-out benchmark; never seen during training or hyperparameter tuning)

### Known Limitations of RDD2022

1. **Illumination & Shadow Variability**: Dashcam footage contains heavy canopy shadows and variable weather (overcast, midday sun, glare).
2. **Camera Angles & Windshield Distortion**: Subtle reflection or rain droplets on vehicle windshields.
3. **Class Imbalance**: Linear cracks (D00, D10) are more frequent than deep catastrophic potholes (D40). AI-PAVE balances sampling during preprocessing.
4. **Bounding Boxes vs Segmentation**: Raw RDD2022 provides Pascal VOC XML bounding boxes. For polygon instance masks, AI-PAVE uses SAM/segmentation annotations or fine-tunes on verified polygon pothole subsets.

---

## 2. Pothole Instance Segmentation Dataset

- **Purpose**: Precise boundary polygon masks for perimeter, area, and contour extraction.
- **License**: Open Access / CC BY 4.0
- **Annotation Format**: Polygon coordinates normalized to `[0.0, 1.0]` (YOLOv8-seg format).

---

## 3. Normalized Internal Dataset Directory Structure

All datasets are converted to the following unified directory layout:

```text
datasets/
├── raw/                      # Original raw archives / downloads
├── processed/                # Normalized, sanitized, and deduplicated
├── annotations/              # Consolidated metadata, hashes, and split logs
├── train/
│   ├── images/               # Training RGB images (.jpg, .png)
│   └── labels/               # YOLO annotations (.txt)
├── val/
│   ├── images/               # Validation images for early stopping
│   └── labels/               # YOLO annotations
├── test/
│   ├── images/               # Strictly held-out test images
│   └── labels/               # Ground truth test labels
└── external_test/            # Out-of-distribution real-world images from other continents/cameras
```

---

## 4. Dataset Validation & Integrity Checklist

The automated validation tool `scripts/validate_dataset.py` enforces:
- [x] Zero missing image references or orphaned label files
- [x] Coordinates within valid normalized bounds `0.0 <= x, y, w, h <= 1.0`
- [x] Elimination of zero-area or inverted bounding boxes
- [x] Verification of image file integrity (no truncated headers or decode errors)
- [x] Checksum and perceptual hash deduplication report
