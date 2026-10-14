# AI-PAVE: AI-Based Pothole Detection, Measurement, Severity Assessment & Road Maintenance Recommendation System

**AI-PAVE** is a production-grade, software-only pavement inspection application engineered for civil engineers, municipal highway authorities, and pavement maintenance contractors. It performs automated detection, instance segmentation, relative depth profiling, geometric measurement, severity scoring, and deterministic maintenance recommendation generation from road surface RGB imagery and dashcam video.

---

## 1. System Architecture

```text
IMAGE / VIDEO
      │
      ▼
PREPROCESSING (Resolution standardization, color-space mapping)
      │
      ▼
NEURAL DEFECT DETECTION (YOLOv8 bounding box localization)
      │
      ▼
INSTANCE SEGMENTATION (Polygon boundary contour extraction)
      │
      ▼
MONOCULAR DEPTH ESTIMATION (Perspective gradient & localized contrast depression)
      │
      ▼
GEOMETRIC MEASUREMENT ENGINE (Pixel dimensions, area, circularity, aspect ratio)
      │
      ▼
SEVERITY ENGINE (Multi-factor scoring: Area, Depth Index, Shape, Road Trajectory)
      │
      ▼
SURFACE DISTRESS & FACTOR ANALYSIS (Visual cues: water, cracking, spalling, aging)
      │
      ▼
DETERMINISTIC RECOMMENDATION ENGINE (Civil engineering protocols & urgency tiers)
      │
      ▼
MONGODB PERSISTENCE & PDF REPORT GENERATION (ReportLab downloadable inspection report)
```

---

## 2. Key Features

- **Software-Only & Hardware Independent**: Requires zero physical ultrasonic sensors, microcontrollers, Raspberry Pi, or external GPS hardware. Operates directly on standard RGB imagery and vehicle dashcam videos.
- **Instance Segmentation**: Extracts precise boundary polygons for contour geometry, perimeter, and area rather than rudimentary bounding boxes.
- **Monocular Relative Depth Engine**: Distinguishes relative surface depression profiles by comparing localized pothole interior depth against the surrounding baseline pavement plane.
- **No Fabricated Measurements**: Physical units (meters/centimetres) are strictly reported *only* when calibrated reference scale factors are provided; uncalibrated inputs are transparently labeled *"Requires calibration"* and *"Relative estimate"*.
- **Multi-Object Video Tracking**: Tracks potholes across consecutive frames to avoid double-counting, computing unique pothole statistics and exporting annotated tracking videos.
- **Deterministic Maintenance Recommendations**: Generates explainable, engineering-oriented procedures (cold patch, full-depth saw-cutting, HMA compaction, crack sealing) accompanied by structural disclaimers.
- **Downloadable PDF Reports**: Automated generation of comprehensive inspection sheets using ReportLab.
- **Zero-Leakage Dataset Pipeline**: Supports RDD2022 with perceptual hashing (dHash) and MD5 checksum deduplication across Train, Validation, and Test splits.

---

## 3. Technology Stack

- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, PyTorch, Ultralytics YOLOv8, OpenCV, NumPy, SciPy, Scikit-learn, Pandas, Pillow, ReportLab, Structlog.
- **Database**: MongoDB (via PyMongo / Motor) with resilient local document store fallback.
- **Frontend**: React 19, TypeScript, Vite, Material UI (MUI), Recharts, React Dropzone, HTML5 Video.
- **Containerization**: Docker, Docker Compose, Nginx.

---

## 4. Quick Start & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) MongoDB running on port 27017
- (Optional) NVIDIA GPU with CUDA drivers

### Clone & Environment Setup
```bash
git clone https://github.com/organization/AI-PAVE.git
cd AI-PAVE

# Configure environment variables
cp .env.example .env
```

### Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 5. Dataset Ingestion & Validation (RDD2022)

AI-PAVE supports the international **Road Damage Dataset 2022 (RDD2022)** from Kaggle:
- **Kaggle Link**: [https://www.kaggle.com/datasets/aliabdelmenam/rdd-2022](https://www.kaggle.com/datasets/aliabdelmenam/rdd-2022)
- **License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Class Code**: `D40` (Pothole)

### Prepare & Deduplicate Dataset
```bash
# Prepare dataset and enforce perceptual hash deduplication
python scripts/prepare_dataset.py --generate-sample
```

### Validate Dataset Integrity
```bash
python scripts/validate_dataset.py
```
Outputs `artifacts/evaluation/dataset_report.json` and `artifacts/evaluation/dataset_report.html`.

---

## 6. Model Training & Real Evaluation

### Train YOLO Detector
```bash
python training/train_detector.py
```
Checkpoints are saved to `artifacts/models/pothole_detector_yolo.pt` with complete reproducibility metadata in `artifacts/models/detector_metadata.json`.

### Train YOLO Segmenter
```bash
python training/train_segmenter.py
```

### Run Real Evaluation (Strictly Held-Out Test Set)
```bash
python training/evaluate.py
```
Generates honest, non-fabricated metrics:
- Precision, Recall, F1 Score
- mAP@50 and mAP@50:95
- Detection IoU, Mask IoU, Dice Score
- Confusion Matrix (`artifacts/evaluation/confusion_matrix.png`)
- Precision-Recall Curve (`artifacts/evaluation/pr_curve.png`)
- Error analysis breakdown (`artifacts/evaluation/error_analysis.json`)

---

## 7. Running the Application

### Start Backend API Server
```bash
# From workspace root
set PYTHONPATH=./backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Access the application at: `http://localhost:5173`

---

## 8. Docker Deployment

Deploy the entire stack (Frontend, Backend, and MongoDB) via Docker Compose:
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- MongoDB: `localhost:27017`

---

## 9. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/analyze/image` | Upload image for detection, segmentation, depth, and severity |
| `POST` | `/api/v1/analyze/video` | Upload video for frame tracking and summary report |
| `GET` | `/api/v1/analyses` | List recent inspections with thumbnail and condition |
| `GET` | `/api/v1/analysis/{id}` | Retrieve complete inspection document |
| `DELETE`| `/api/v1/analysis/{id}` | Delete inspection record and associated artifacts |
| `GET` | `/api/v1/analysis/{id}/report.pdf` | Download ReportLab generated PDF report |
| `GET` | `/api/v1/dashboard/stats` | Aggregated dashboard statistics and trends |
| `GET` | `/api/v1/models` | Active model registry and checkpoint metadata |
| `GET` | `/api/v1/evaluation` | Real evaluation benchmark metrics and error analysis |
| `GET` | `/api/v1/health` | Health status and GPU availability |
| `GET` | `/api/v1/system/info` | Host hardware telemetry and platform diagnostics |

---

## 10. Automated Testing

Run the automated test suite covering ML inference, geometry, severity rules, security validation, and API routes:
```bash
set PYTHONPATH=./backend
python -m pytest tests/test_all.py -v
```

---

## 11. Engineering Disclaimers & Limitations

1. **Depth Estimation**: Single-camera RGB monocular depth estimation derives relative depth from perspective and photometric attenuation. Physical centimetre depth is not reported without user-provided scale calibration.
2. **Decision Support**: Recommendations generated by AI-PAVE are deterministic civil engineering guidelines. Mandatory on-site structural inspection by licensed highway engineers is required prior to pavement intervention.
3. **Environmental Factors**: Performance may degrade under extreme nighttime darkness, heavy deluge/flooding, or snow cover.

---

## 12. License & Citation

- **License**: Apache 2.0
- **Dataset License**: RDD2022 is licensed under CC BY-SA 4.0.
