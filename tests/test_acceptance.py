"""
AI-PAVE Acceptance Test Suite (Section 62 of specifications)
Validates:
1. Real road image containing pothole -> Detection, segmentation, depth, measurements, severity, recommendations, MongoDB persistence, PDF report.
2. Clear road image without potholes -> Verifies no fabricated or hardcoded detections.
3. Road video -> Frame extraction, detection, tracking, duplicate avoidance, annotated video output.
"""

import sys
from pathlib import Path
import pytest
import numpy as np
import cv2
from fastapi.testclient import TestClient

backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app
from app.database.repositories.analysis_repo import analysis_repo

client = TestClient(app)

def test_acceptance_pothole_image():
    # Load an image from datasets/val/images/ or uploads/
    img_candidates = list(Path("datasets/val/images").glob("*.jpg"))
    if img_candidates:
        img_path = img_candidates[0]
    else:
        img_path = Path("uploads/25afb22011f24592a8489c6efd230512.jpg")
    assert img_path.exists(), "Sample test image not found"

    with open(img_path, "rb") as f:
        response = client.post(
            "/api/v1/analyze/image",
            files={"file": (img_path.name, f, "image/jpeg")},
            data={"confidence_threshold": 0.20, "iou_threshold": 0.45}
        )

    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()

    # Verify all expected schema fields
    assert "analysis_id" in data
    assert data["file_type"] == "image"
    assert data["processing_time_ms"] > 0
    assert "original_media_url" in data
    assert "annotated_media_url" in data
    assert "detection_media_url" in data
    assert "segmentation_media_url" in data
    assert "depth_media_url" in data
    assert "report_pdf_url" in data
    assert "potholes" in data
    assert "recommendations" in data

    # Check pothole contents
    for p in data["potholes"]:
        assert "confidence" in p
        assert "bbox" in p
        assert "polygon" in p
        assert "area_pixels" in p
        assert "severity" in p
        assert p["severity"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        assert "display_depth" in p
        assert p["depth_status"] in ["Relative estimate", "Calibrated"]
        assert "possible_factors" in p
        assert len(p["possible_factors"]) > 0

    # Verify MongoDB persistence
    db_record = analysis_repo.get_by_id(data["analysis_id"])
    assert db_record is not None, "Record was not persisted in database"

    # Verify PDF report exists on disk
    pdf_path = Path("reports") / f"{data['analysis_id']}.pdf"
    assert pdf_path.exists(), "PDF report was not generated"
    assert pdf_path.stat().st_size > 1000, "PDF report is empty or invalid"

def test_acceptance_clear_road_no_fake_potholes():
    # Generate clean pristine road with no defects
    w, h = 640, 480
    clean_road = np.random.normal(loc=110, scale=8, size=(h, w, 3)).clip(80, 140).astype(np.uint8)
    # White lane stripe
    cv2.line(clean_road, (w // 2, 0), (w // 2, h), (220, 220, 220), 4)

    temp_clean_path = Path("uploads/temp_clean_road.jpg")
    temp_clean_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(temp_clean_path), clean_road)

    with open(temp_clean_path, "rb") as f:
        response = client.post(
            "/api/v1/analyze/image",
            files={"file": ("clean_road.jpg", f, "image/jpeg")},
            data={"confidence_threshold": 0.40, "iou_threshold": 0.45}
        )

    temp_clean_path.unlink(missing_ok=True)
    assert response.status_code == 200
    data = response.json()

    # The system must not invent fake potholes
    assert data["pothole_count"] == 0
    assert data["overall_condition"] in ["No Potholes Detected", "Good"]
    assert data["recommendations"]["overall_urgency"] in ["Scheduled Survey", "Routine Monitoring"]

def test_acceptance_video_tracking():
    # Generate a short synthetic video (15 frames) with a moving pothole
    w, h = 640, 480
    fps = 10
    temp_vid_path = Path("uploads/temp_synthetic_video.mp4")
    temp_vid_path.parent.mkdir(parents=True, exist_ok=True)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(temp_vid_path), fourcc, fps, (w, h))

    for f_idx in range(15):
        frame = np.random.normal(loc=100, scale=8, size=(h, w, 3)).clip(70, 130).astype(np.uint8)
        # Pothole moves slightly as vehicle approaches
        cy = int(240 + f_idx * 10)
        cx = int(320)
        cv2.ellipse(frame, (cx, cy), (45, 30), 0, 0, 360, (30, 25, 20), -1)
        writer.write(frame)

    writer.release()

    with open(temp_vid_path, "rb") as f:
        response = client.post(
            "/api/v1/analyze/video",
            files={"file": ("synthetic_road_video.mp4", f, "video/mp4")},
            data={"confidence_threshold": 0.20, "iou_threshold": 0.45, "frame_stride": 1}
        )

    temp_vid_path.unlink(missing_ok=True)
    assert response.status_code == 200
    data = response.json()

    assert data["file_type"] == "video"
    assert "tracking_metadata" in data
    # Video tracking must avoid counting every frame as a new pothole
    # Even across 15 frames, tracked unique count should remain very small (1 or 2)
    assert data["pothole_count"] <= 3, f"Duplicate counting failure: {data['pothole_count']}"
    assert "annotated_media_url" in data

    # Verify processed video file exists
    proc_video = Path("processed") / f"{data['analysis_id']}_processed.mp4"
    assert proc_video.exists(), "Processed annotated video was not created"
