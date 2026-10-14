"""
AI-PAVE Analysis Schema Definitions
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.pothole import PotholeDetection, CalibrationInput
from app.schemas.recommendation import MaintenanceSummary

class AnalysisResponse(BaseModel):
    analysis_id: str
    file_name: str
    file_type: str # "image" or "video"
    model_version: str
    created_at: str
    processing_time_ms: float
    
    # Media paths (URLs served by backend)
    original_media_url: str
    annotated_media_url: Optional[str] = None
    detection_media_url: Optional[str] = None
    segmentation_media_url: Optional[str] = None
    depth_media_url: Optional[str] = None
    report_pdf_url: Optional[str] = None

    # Image / Video Meta
    media_dimensions: List[int] = Field(default_factory=list) # [width, height]
    frame_count: Optional[int] = None
    fps: Optional[float] = None
    duration_seconds: Optional[float] = None

    # Detection & Severity Results
    pothole_count: int
    overall_condition: str # "Good", "Fair", "Poor", "Severely Damaged"
    road_condition_source: str # "Rule-based assessment" or "Model-based classification"
    severity_breakdown: Dict[str, int] = Field(default_factory=dict) # {"CRITICAL": 0, "HIGH": 1, ...}
    average_confidence: float
    
    # Potholes & Recommendations
    potholes: List[PotholeDetection] = Field(default_factory=list)
    recommendations: MaintenanceSummary

    # Calibration & Tracking info
    calibration: Optional[CalibrationInput] = None
    tracking_metadata: Optional[Dict[str, Any]] = None

    # ML Evaluation & Diagnostic Metrics (sklearn & geometric alignment)
    evaluation: Optional[Dict[str, Any]] = None

class AnalysisListItem(BaseModel):
    analysis_id: str
    file_name: str
    file_type: str
    model_version: str
    created_at: str
    processing_time_ms: float
    pothole_count: int
    overall_condition: str
    high_severity_count: int
    average_confidence: float
    thumbnail_url: Optional[str] = None

class DashboardStats(BaseModel):
    total_analyses: int
    total_potholes_detected: int
    high_severity_potholes: int
    average_confidence: float
    average_processing_time_ms: float
    severity_distribution: Dict[str, int]
    detection_trend: List[Dict[str, Any]]
    has_data: bool
