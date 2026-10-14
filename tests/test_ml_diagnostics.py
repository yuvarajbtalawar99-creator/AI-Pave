"""
AI-PAVE ML Diagnostics & Regression Test Suite
Validates all 12 scenarios outlined in Phase M of the ML Diagnostic Specification:
1. Visible pothole image detection
2. Clear road background behavior
3. Wrong/missing checkpoint handling
4. Class mapping integrity
5. Confidence threshold configuration & filtering
6. Zero detection reporting (non-fabricated condition)
7. Segmentation boundary containment
8. Calibration unavailable reporting
9. Invalid image error handling
10. Historical persistence consistency
11. Coordinate scaling & clamping
12. API schema contract compliance
"""

import os
import sys
import pytest
import numpy as np
import cv2
from pathlib import Path

# Ensure backend is in python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.ml.detector import YOLODetector
from app.ml.segmenter import YOLOSegmenter
from app.ml.depth_model import MonocularDepthModel
from app.services.measurement_service import measurement_service
from app.services.severity_service import severity_service
from app.services.recommendation_service import recommendation_service
from app.services.detection_service import detection_service
from app.database.repositories.analysis_repo import analysis_repo
from app.schemas.analysis import AnalysisResponse

TEST_IMAGE_PATH = BASE_DIR / "uploads" / "25afb22011f24592a8489c6efd230512.jpg"
MODEL_WEIGHTS_PATH = BASE_DIR / "artifacts" / "models" / "pothole_detector_yolo.pt"

@pytest.fixture
def detector():
    return YOLODetector(str(MODEL_WEIGHTS_PATH), device="cpu")

@pytest.fixture
def clear_road_image():
    # 640x480 gray asphalt without defects
    img = np.full((480, 640, 3), 110, dtype=np.uint8)
    # Add lane marking
    cv2.line(img, (320, 0), (320, 480), (220, 220, 220), 4)
    return img

# Test 1: Visible pothole image regression test
def test_1_visible_pothole_detection(detector):
    assert TEST_IMAGE_PATH.exists(), f"Failing test image not found at {TEST_IMAGE_PATH}"
    img = cv2.imread(str(TEST_IMAGE_PATH))
    assert img is not None
    detections = detector.predict(img, conf_threshold=0.25)
    assert len(detections) >= 1, "Visible pothole was not detected with adaptive multi-scale inference"
    box = detections[0]["bbox"]
    assert box[0] < box[2] and box[1] < box[3]
    assert detections[0]["confidence"] >= 0.25
    assert detections[0]["class_id"] == 0
    assert detections[0]["class_name"] == "pothole"

# Test 2: Clear road image does not generate false detections
def test_2_clear_road_no_false_positives(detector, clear_road_image):
    detections = detector.predict(clear_road_image, conf_threshold=0.35)
    assert len(detections) == 0, "Clear road generated false positive pothole detections"

# Test 3: Wrong / missing checkpoint handling
def test_3_missing_checkpoint_handling():
    det = YOLODetector()
    with pytest.raises(Exception):
        det.load("non_existent_weights_xyz.pt")

# Test 4: Class mapping
def test_4_class_mapping(detector):
    assert detector.model is not None
    assert 0 in detector.model.names
    assert detector.model.names[0].lower() == "pothole"

# Test 5: Confidence threshold filtering
def test_5_confidence_threshold_filtering(detector):
    img = cv2.imread(str(TEST_IMAGE_PATH))
    det_low = detector.predict(img, conf_threshold=0.20)
    det_high = detector.predict(img, conf_threshold=0.95)
    assert len(det_low) >= len(det_high), "Confidence filtering did not respect thresholds"

# Test 6: Zero detections does not falsely claim the pavement is "Good"
def test_6_zero_detections_honest_reporting():
    condition, source, counts = severity_service.calculate_overall_road_condition([], (640, 480))
    assert condition != "Good", "Zero detections falsely labeled pavement as 'Good'"
    assert "No Potholes Detected" in condition

    recs = recommendation_service.generate_recommendations([], condition)
    assert "Routine Survey" in recs.action_items[0].category or "Scheduled Survey" in recs.overall_urgency
    assert "No potholes detected" in recs.action_items[0].inspection_protocol

# Test 7: Segmentation boundaries stay within image coordinates
def test_7_segmentation_boundaries():
    seg = YOLOSegmenter(device="cpu")
    dummy_img = np.zeros((200, 300, 3), dtype=np.uint8)
    boxes = [[50, 40, 150, 120]]
    results = seg.segment(dummy_img, boxes=boxes, conf_threshold=0.25)
    assert len(results) == 1
    for pt in results[0]["polygon"]:
        assert 0 <= pt[0] <= 300
        assert 0 <= pt[1] <= 200

# Test 8: Calibration unavailable reports pixel units without invented metric measurements
def test_8_calibration_unavailable_behavior():
    pts = np.array([[10, 10], [50, 10], [50, 40], [10, 40]])
    m = measurement_service.compute_pothole_measurements(
        polygon_pts=pts,
        bbox=[10, 10, 50, 40],
        image_dims=(640, 480),
        calibration_scale_cm_per_px=None
    )
    assert not m["is_calibrated"]
    assert m["physical_area_m2"] is None
    assert "Requires calibration" in m["display_area"]
    assert m["area_pixels"] > 0

# Test 9: Invalid image handling
def test_9_invalid_image_handling():
    with pytest.raises(ValueError):
        detection_service.process_image(Path("missing_file_123.jpg"), "test_err", "missing.jpg")

# Test 10: Historical persistence consistency
def test_10_persistence_consistency():
    test_id = "test_persistence_sync_001"
    doc = {
        "analysis_id": test_id,
        "file_name": "test.jpg",
        "file_type": "image",
        "model_version": "v8n-rdd2022-gpu-trained",
        "pothole_count": 1,
        "overall_condition": "Poor",
        "average_confidence": 0.85,
        "potholes": [{"pothole_id": 1, "severity": "HIGH", "confidence": 0.85}],
        "recommendations": {"overall_urgency": "High Priority", "action_items": []},
        "calibration": {"is_calibrated": False, "pixel_scale_factor": None}
    }
    analysis_repo.save(doc)
    retrieved = analysis_repo.get_by_id(test_id)
    assert retrieved is not None
    assert retrieved["analysis_id"] == test_id
    assert retrieved["pothole_count"] == 1
    assert retrieved["overall_condition"] == "Poor"

# Test 11: Image coordinate scaling and clamping
def test_11_coordinate_clamping(detector):
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    # Add high contrast patch
    cv2.circle(img, (50, 50), 30, (255, 255, 255), -1)
    dets = detector.predict(img, conf_threshold=0.01)
    for d in dets:
        x1, y1, x2, y2 = d["bbox"]
        assert 0.0 <= x1 <= 100.0
        assert 0.0 <= y1 <= 100.0
        assert 0.0 <= x2 <= 100.0
        assert 0.0 <= y2 <= 100.0

# Test 12: API response schema validation
def test_12_api_schema_contract():
    doc = detection_service.process_image(TEST_IMAGE_PATH, "test_schema_id", "images.jpg")
    validated = AnalysisResponse(**doc)
    assert validated.analysis_id == "test_schema_id"
    assert validated.pothole_count >= 1
    assert validated.potholes[0].confidence >= 0.25
    assert validated.overall_condition in ["Poor", "Severely Damaged", "Fair", "Minor Distress"]
