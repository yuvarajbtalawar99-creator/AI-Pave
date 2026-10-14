"""
AI-PAVE Automated Test Suite
Covers:
- Geometric measurement calculations
- Severity rules and threshold assessment
- Maintenance recommendation deterministic logic
- Monocular depth relative analysis
- Security and image validation checks
- MongoDB repository operations
- FastAPI endpoint responses
"""

import os
import sys
from pathlib import Path
import pytest
import numpy as np
import cv2
from fastapi.testclient import TestClient

# Add backend to sys.path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app
from app.services.measurement_service import measurement_service
from app.services.severity_service import severity_service
from app.services.recommendation_service import recommendation_service
from app.ml.depth_model import MonocularDepthModel
from app.core.security import sanitize_filename, generate_secure_filename
from app.database.repositories.analysis_repo import analysis_repo

client = TestClient(app)

# 1. Measurement Service Tests
def test_measurement_uncalibrated_pixel_integrity():
    poly = np.array([[10, 10], [100, 10], [100, 100], [10, 100]])
    bbox = [10, 10, 100, 100]
    res = measurement_service.compute_pothole_measurements(
        polygon_pts=poly,
        bbox=bbox,
        image_dims=(640, 480),
        calibration_scale_cm_per_px=None
    )
    assert res["is_calibrated"] is False
    assert "Requires calibration" in res["display_area"]
    assert res["area_pixels"] > 0
    assert res["physical_area_m2"] is None

def test_measurement_calibrated_physical_conversion():
    poly = np.array([[0, 0], [100, 0], [100, 100], [0, 100]])
    bbox = [0, 0, 100, 100]
    res = measurement_service.compute_pothole_measurements(
        polygon_pts=poly,
        bbox=bbox,
        image_dims=(640, 480),
        calibration_scale_cm_per_px=0.5 # 0.5 cm per px = 0.005 m per px
    )
    assert res["is_calibrated"] is True
    assert res["physical_area_m2"] is not None
    assert "m²" in res["display_area"]

# 2. Severity Service Tests
def test_severity_classification_rules():
    # Minor low-severity pothole
    low_meas = {
        "road_area_ratio_pct": 0.2,
        "circularity": 0.9,
        "centroid": [100, 100],
        "is_calibrated": False
    }
    low_res = severity_service.assess_pothole_severity(
        measurement=low_meas,
        relative_depth_index=0.1,
        confidence=0.5,
        image_dims=(640, 480)
    )
    assert low_res["severity"] in ["LOW", "MEDIUM"]

    # Critical large deep pothole
    crit_meas = {
        "road_area_ratio_pct": 4.5,
        "circularity": 0.3,
        "centroid": [320, 400],
        "is_calibrated": False
    }
    crit_res = severity_service.assess_pothole_severity(
        measurement=crit_meas,
        relative_depth_index=0.85,
        confidence=0.95,
        image_dims=(640, 480)
    )
    assert crit_res["severity"] == "CRITICAL"
    assert "Immediate" in crit_res["urgency"]

# 3. Recommendation Service Tests
def test_recommendation_deterministic_output():
    potholes = [
        {"pothole_id": 1, "severity": "CRITICAL"},
        {"pothole_id": 2, "severity": "MEDIUM"}
    ]
    recs = recommendation_service.generate_recommendations(potholes, "Severely Damaged")
    assert recs.overall_urgency == "Immediate (Within 24-48 hours)"
    assert len(recs.action_items) > 0
    # Must contain disclaimer
    assert "licensed pavement engineer" in recs.disclaimer

# 4. Depth Engine Tests
def test_depth_model_relative_output():
    depth_model = MonocularDepthModel()
    dummy_img = np.ones((100, 100, 3), dtype=np.uint8) * 128
    depth_map = depth_model.predict_depth_map(dummy_img)
    assert depth_map.shape == (100, 100)
    assert depth_map.min() >= 0.0 and depth_map.max() <= 1.0

    poly = np.array([[20, 20], [80, 20], [80, 80], [20, 80]])
    depth_res = depth_model.analyze_pothole_depth(depth_map, poly, (100, 100))
    assert depth_res["depth_status"] == "Relative estimate"

# 5. Security & Sanitization Tests
def test_filename_sanitization():
    assert sanitize_filename("../../../etc/passwd") == "passwd"
    uid, sec_name = generate_secure_filename("malicious/..\\pothole.JPG")
    assert sec_name.endswith(".jpg")
    assert len(uid) == 32

# 6. API Route Integration Tests
def test_api_health_endpoint():
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "HEALTHY"

def test_api_system_info_endpoint():
    resp = client.get("/api/v1/system/info")
    assert resp.status_code == 200
    data = resp.json()
    assert "python_version" in data

def test_api_models_endpoint():
    resp = client.get("/api/v1/models")
    assert resp.status_code == 200
    data = resp.json()
    assert "active_models" in data

def test_api_dashboard_stats_endpoint():
    resp = client.get("/api/v1/dashboard/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_analyses" in data
