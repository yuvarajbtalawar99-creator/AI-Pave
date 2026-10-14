# AI-PAVE — Complete ML Diagnosis, Root-Cause Analysis, and End-to-End Correction Report

**Project**: AI-PAVE (AI-Based Pavement Inspection, Pothole Detection, Measurement, Severity Assessment, and Road Maintenance Recommendation System)  
**Date**: October 4, 2026  
**Auditor**: Senior ML / Computer Vision / Full-Stack Systems Engineer  
**Workspace Root**: `E:\AI-PAVE`  
**Git Branch**: `master`  
**Platform**: Windows 11 / Python 3.14 / React 19 / Vite 8 / Ultralytics YOLOv8  

---

## A. Executive Summary

### 1. What Was Wrong
When users uploaded road imagery containing clearly visible potholes (such as `uploads/25afb22011f24592a8489c6efd230512.jpg`, original filename `images.jpg`), the application exhibited critical failures across multiple pipeline layers:
1. **0 Potholes Detected**: The detector produced zero detections despite a glaringly obvious water-filled pothole in the frame.
2. **Receptive Field Upsampling Collapse**: The uploaded image had small dimensions (`223 x 148` pixels). Inference defaulted to fixed `imgsz=640`, which upscaled the image by 4.3x. The resulting bilinear interpolation blur destroyed the edge gradients of the asphalt and depression rim, collapsing raw neural confidence from `55.1%` down to `2.36%` (below the `0.25` threshold).
3. **Falsely Reassuring Condition**: When zero potholes were detected, `SeverityService` defaulted to labeling the pavement as **"Good"** (`Rule-based assessment`), and `RecommendationService` prescribed **"Routine Monitoring"**, claiming no maintenance was needed for a badly damaged road.
4. **Misleading Monocular Depth Display**: The frontend depth viewer rendered a bright topographic colormap labeled as "Relative Estimate" even when zero potholes were detected, creating the false impression that a pothole depression profile had been quantified.
5. **Frontend Navigation Crash (Blank Page)**: `Navbar.tsx` used `<Box component={Link} />` without importing `Link` from `react-router-dom`, causing an uncaught runtime ReferenceError in React that crashed the entire application into a blank white screen upon navigating to `/analyze`.
6. **Hardcoded Model Versioning**: The model loader hardcoded `"v8n-rdd2022-v1"` regardless of the active weights metadata.

### 2. What Was Fixed
1. **Adaptive Multi-Scale Inference**: Implemented dynamic resolution scaling in `YOLODetector.predict()` (`backend/app/ml/detector.py`). Low-resolution inputs (<=384px) are evaluated at native-scale `320px`/`416px` with multi-scale Non-Maximum Suppression (NMS), boosting confidence on the failing image from **2.36% to 55.13%** and localizing the center pothole bounding box (`[62.98, 65.07, 137.96, 98.84]`).
2. **Honest Zero-Defect Reporting**: Corrected `SeverityService` so zero detections produces `"No Potholes Detected"` rather than falsely reassuring municipal authorities with `"Good"`. Added a prominent engineering disclosure banner in the UI stating that zero detections does not guarantee the pavement is defect-free.
3. **Context-Aware Depth Viewer**: Updated `DepthViewer.tsx` to display a clear empty state when no pothole is detected or selected, clearly distinguishing global scene perspective topography from localized pothole depression analysis.
4. **Dynamic Model Versioning & Missing Checkpoint Defense**: `YOLODetector` now dynamically resolves versioning from `artifacts/models/detector_metadata.json` (`v8n-rdd2022-gpu-trained`), and raises explicit `FileNotFoundError` instead of silently loading unverified fallbacks.
5. **Video Tracking Stability**: Enhanced spatial centroid proximity matching in `SimpleSORTTracker` (`video_service.py`) to prevent camera approach velocity from fragmenting single potholes into duplicate tracks.
6. **Frontend Navbar Import**: Added `Link` to `react-router-dom` in `Navbar.tsx`, fully resolving the blank page crash.
7. **Regression Suite**: Created `tests/test_ml_diagnostics.py` verifying all 12 Phase M scenarios. The full 25-test project suite passes with 100% success.

---

## B. Root Cause Analysis

### Issue 1: Detection Collapse on Small or Variable-Scale Input Imagery
* **Evidence**: Image `uploads/25afb22011f24592a8489c6efd230512.jpg` (223x148 px) yielded `pothole_count: 0`, raw `conf: 0.0236` at `imgsz=640`.
* **Affected File / Function**: `backend/app/ml/detector.py` -> `YOLODetector.predict()`
* **Reproduction**:
  ```python
  from ultralytics import YOLO
  m = YOLO("artifacts/models/pothole_detector_yolo.pt")
  res = m.predict("uploads/25afb22011f24592a8489c6efd230512.jpg", imgsz=640, conf=0.01)
  # Max confidence is 0.0236 -> Filtered out by conf_threshold=0.25
  ```
* **Root Cause**: The YOLOv8 feature extractor operates at fixed stride ratios (P3=stride 8, P4=stride 16, P5=stride 32). Forcing a small 223x148 thumbnail to scale up by 4.3x to 640x640 introduces heavy interpolation blurring, destroying high-frequency edge gradients of the asphalt rim.
* **Fix Applied**: Implemented adaptive multi-scale scaling:
  ```python
  if max_dim <= 384:
      scales = [320, 416]
  elif max_dim <= 512:
      scales = [416, 512, 640]
  else:
      scales = [640, 480]
  ```
  Candidate detections across scales are fused with `cv2.dnn.NMSBoxes`.
* **Verification Result**: At `imgsz=320`, confidence rises to **`0.5513` (55.13%)**, successfully detecting the pothole with bounding box `[62.98, 65.07, 137.96, 98.84]`. Verified in `tests/test_ml_diagnostics.py::test_1_visible_pothole_detection` (PASSED).

### Issue 2: False "Good" Road Condition on Zero Detections
* **Evidence**: `analysis_repo.get_by_id("25afb22011f24592a8489c6efd230512")` stored `"overall_condition": "Good"`.
* **Affected File / Function**: `backend/app/services/severity_service.py` -> `SeverityService.calculate_overall_road_condition()`
* **Reproduction**:
  ```python
  sev, src, counts = severity_service.calculate_overall_road_condition([], (640, 480))
  # Returned ("Good", "Rule-based assessment", ...)
  ```
* **Root Cause**: The function checked `if len(potholes) == 0: return "Good"`. This conflated "the model did not detect a defect at this threshold" with "the pavement has been certified free of defects".
* **Fix Applied**: Updated `calculate_overall_road_condition()` to return `"No Potholes Detected"` with condition source `"Rule-based assessment (0 detections)"`.
* **Verification Result**: Verified in `tests/test_ml_diagnostics.py::test_6_zero_detections_honest_reporting` (PASSED).

### Issue 3: Misleading Monocular Depth Display
* **Evidence**: When `pothole_count === 0`, the UI still displayed a vivid colormap and labeled it "Relative Estimate" with depression metrics headers.
* **Affected File / Function**: `frontend/src/components/DepthViewer/DepthViewer.tsx`
* **Root Cause**: The component rendered the depth colormap unconditionally and defaulted to "Relative Estimate" chip even when `selectedPothole` was `null`.
* **Fix Applied**: 
  - When `selectedPothole` is `null`, chip displays `"Scene Macro Topography"`.
  - Alert displays: *"No pothole defect selected. Localized depression profiling requires a detected defect boundary. The topography below illustrates the global roadway perspective gradient."*
  - Dedicated empty-state dashed box indicates no localized defect is active.
* **Verification Result**: Verified in UI rendering and frontend production build.

### Issue 4: Blank Page Navigation Crash
* **Evidence**: Navigating to `http://localhost:5173/analyze` resulted in a blank white page.
* **Affected File / Function**: `frontend/src/components/Navbar.tsx` (Line 3, Line 32)
* **Root Cause**: `import { NavLink, useLocation } from 'react-router-dom';` omitted `Link`, while line 32 rendered `<Box component={Link} to="/" />`. `Link` evaluated to `undefined` at runtime, causing React to throw an unhandled `ReferenceError: Link is not defined`.
* **Fix Applied**: Updated import to `import { Link, NavLink, useLocation } from 'react-router-dom';`.
* **Verification Result**: Verified with browser DOM inspection and screenshot capture (`analyze_page_state.png`). Page renders all controls and upload areas correctly.

---

## C. Model and Dataset Audit

### 1. Active Checkpoint
* **Resolved Checkpoint Path**: `artifacts/models/pothole_detector_yolo.pt`
* **File Size**: 6,246,122 bytes (~5.96 MB)
* **Architecture**: Ultralytics YOLOv8n (Detection task)
* **Model Parameters**: 3,011,043 parameters, 225 layers
* **Model Classes**: `{0: 'pothole'}`
* **Training Hardware**: NVIDIA T4 GPU (16 GB VRAM)
* **Training Duration**: 1,228.99 seconds (~20.5 minutes for 15 epochs)
* **Hyperparameters**: `epochs=15, imgsz=640, batch=32, lr0=0.002, optimizer=AdamW`

### 2. Dataset Split & Class Distribution
The dataset is structured under `E:\AI-PAVE\datasets`:
* **Dataset Source**: Road Damage Dataset 2022 (RDD2022)
* **Class Mapping**: RDD2022 Class `3` (`D40` pothole) mapped strictly to YOLO Class `0` (`pothole`). All non-pothole classes (`D00`, `D10`, `D20`) excluded from positive labels.
* **Total Images**: 38,385
* **Pothole Images**: 7,440
* **Pothole Bounding Boxes**: 10,705 (100% verified as class `0`)
* **Split Counts**:
  - `train`: 26,869 images, 26,869 labels
  - `val`: 5,758 images, 5,758 labels
  - `test`: 5,758 images, 5,758 labels
* **Near-Duplicate Protection**: MD5 exact hash and perceptual difference hash (`dHash`) filtering applied during dataset preparation.

---

## D. Before-and-After Behavior (Failing Image: `images.jpg`)

| Metric / Field | Before Diagnosis | After Correction |
| :--- | :--- | :--- |
| **Inference Scaling** | Fixed `640px` (4.3x upscaling blur) | Adaptive Multi-Scale (`320px` / `416px`) |
| **Raw Model Confidence** | `0.0236` (2.36%) | **`0.5513` (55.13%)** |
| **Potholes Identified** | `0 Defects` | **`1 Defect`** |
| **Bounding Box** | None | **`[62.98, 65.07, 137.96, 98.84]`** |
| **Instance Segmentation** | None | **Contour extracted via adaptive Otsu ROI** |
| **Overall Condition** | `Good` *(False reassurance)* | **`Poor`** *(Severity: HIGH)* |
| **Maintenance Urgency** | `Routine Monitoring` | **`High Priority (Within 3-7 days)`** |
| **Depth Status** | False colormap shown | **Localized depression profile computed against baseline** |
| **Model Version** | Hardcoded `v8n-rdd2022-v1` | Dynamic `v8n-rdd2022-gpu-trained` |
| **Frontend UI** | Blank page or misleading zero-defect UI | Clean, interactive analysis and overlay display |

---

## E. Actual Model Evaluation Results

From the checkpoint training log and validation metrics:
* **Evaluated Model**: AI-PAVE YOLOv8n (`v8n-rdd2022-gpu-trained`)
* **Operating Confidence Threshold**: `0.25`
* **Operating IoU Threshold**: `0.45`
* **Validation mAP@50**: **`0.79714` (79.71%)**
* **Validation mAP@50:95**: **`0.47865` (47.87%)**
* **Validation Precision**: **`0.77124` (77.12%)**
* **Validation Recall**: **`0.71337` (71.34%)**
* **Box Loss**: `1.338`
* **Class Loss**: `1.040`
* **Inference Latency**: ~71.7 ms on CPU per frame

---

## F. Automated Test Suite Results

Full test execution command:
```powershell
py -m pytest tests/ -v
```

### Test Summary: 25 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Test File | Scenario | Status |
| :--- | :--- | :--- |
| `tests/test_ml_diagnostics.py` | `test_1_visible_pothole_detection` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_2_clear_road_no_false_positives` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_3_missing_checkpoint_handling` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_4_class_mapping` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_5_confidence_threshold_filtering` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_6_zero_detections_honest_reporting` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_7_segmentation_boundaries` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_8_calibration_unavailable_behavior` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_9_invalid_image_handling` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_10_persistence_consistency` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_11_coordinate_clamping` | **PASSED** |
| `tests/test_ml_diagnostics.py` | `test_12_api_schema_contract` | **PASSED** |
| `tests/test_acceptance.py` | `test_acceptance_pothole_image` | **PASSED** |
| `tests/test_acceptance.py` | `test_acceptance_clear_road_no_fake_potholes` | **PASSED** |
| `tests/test_acceptance.py` | `test_acceptance_video_tracking` | **PASSED** |
| `tests/test_all.py` | `test_measurement_uncalibrated_pixel_integrity` | **PASSED** |
| `tests/test_all.py` | `test_measurement_calibrated_physical_conversion` | **PASSED** |
| `tests/test_all.py` | `test_severity_classification_rules` | **PASSED** |
| `tests/test_all.py` | `test_recommendation_deterministic_output` | **PASSED** |
| `tests/test_all.py` | `test_depth_model_relative_output` | **PASSED** |
| `tests/test_all.py` | `test_filename_sanitization` | **PASSED** |
| `tests/test_all.py` | `test_api_health_endpoint` | **PASSED** |
| `tests/test_all.py` | `test_api_system_info_endpoint` | **PASSED** |
| `tests/test_all.py` | `test_api_models_endpoint` | **PASSED** |
| `tests/test_all.py` | `test_api_dashboard_stats_endpoint` | **PASSED** |

---

## G. Remaining Limitations

1. **Monocular Depth Nature**: Monocular RGB depth estimation relies on perspective baselines and contrast depression gradients. It does not replace physical surveying tools (e.g. LiDAR or depth calipers). Physical depth measurements are reported strictly only when reference pixel-scale calibration is provided.
2. **Instance Segmentation Head**: The current segmentation pipeline derives polygon contours via active Otsu contouring within detector bounding boxes. For native polygon masks directly from neural heads, a dedicated YOLOv8-seg model trained on polygonal road distress ground truth can be integrated.
3. **Severe Weather / Night Conditions**: Extreme water reflection, heavy glare, or total darkness will reduce contrast and model confidence. Inconclusive analyses are flagged for manual engineering survey.

---

## H. Files Modified

| File | Changes Made |
| :--- | :--- |
| `backend/app/ml/detector.py` | Added multi-scale adaptive resolution (`imgsz`), dynamic metadata version resolution, structured diagnostic logging, coordinate boundary clamping, and explicit `FileNotFoundError` on missing weights. |
| `backend/app/services/severity_service.py` | Changed zero-defect overall condition from misleading `"Good"` to honest `"No Potholes Detected"`. |
| `backend/app/services/recommendation_service.py` | Updated zero-defect recommendations to explicitly state that zero detections does not certify the road as defect-free. |
| `backend/app/services/video_service.py` | Enhanced spatial proximity fallback in `SimpleSORTTracker` to maintain stable pothole tracking across vehicle approach frames. |
| `frontend/src/components/Navbar.tsx` | Fixed missing `Link` import from `react-router-dom` that caused blank page crashes. |
| `frontend/src/components/DepthViewer/DepthViewer.tsx` | Added distinct states for no-defect / no-selection vs localized pothole depression profiling. |
| `frontend/src/pages/Results.tsx` | Fixed average confidence display to show `"N/A (0 defects)"` when no defects exist, and added an automated inspection disclosure alert. |
| `tests/test_acceptance.py` | Updated tests to support real RDD2022 dataset images and accept honest zero-detection condition strings. |
| `tests/test_ml_diagnostics.py` | Created 12-scenario regression test suite covering Phase M. |
| `artifacts/models/detector_metadata.json` | Updated model metadata to reflect the trained GPU weights. |

---

## I. Exact Run Commands (Windows PowerShell)

### 1. Run Complete Backend Test Suite
```powershell
$env:PYTHONPATH = ".\backend"
py -m pytest tests/ -v
```

### 2. Run Only ML Diagnostics Regression Suite
```powershell
$env:PYTHONPATH = ".\backend"
py -m pytest tests/test_ml_diagnostics.py -v
```

### 3. Build Frontend Application
```powershell
cd frontend
npm run build
cd ..
```

### 4. Start the Application
```powershell
# Terminal 1: Start FastAPI Backend
$env:PYTHONPATH = ".\backend"
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Vite Frontend
cd frontend
npm run dev
```

### 5. Access the Web Application
Open your browser at:
```text
http://localhost:5173/analyze
```
Upload any road imagery or dashcam video to execute automated inspection with complete, honest, and robust reporting.
