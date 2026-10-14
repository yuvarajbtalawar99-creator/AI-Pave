"""
AI-PAVE Pothole Schema Definitions
"""

from typing import List, Optional, Tuple, Dict, Any
from pydantic import BaseModel, Field

class CalibrationInput(BaseModel):
    is_calibrated: bool = False
    camera_height_m: Optional[float] = None
    camera_tilt_deg: Optional[float] = None
    reference_dimension_cm: Optional[float] = None
    pixel_scale_factor: Optional[float] = None # cm per pixel if known

class PotholeDetection(BaseModel):
    analysis_id: str
    pothole_id: int
    confidence: float
    bbox: List[float] # [x1, y1, x2, y2] in pixels
    bbox_normalized: Optional[List[float]] = None # [xc, yc, w, h] in [0, 1]
    polygon: Optional[List[List[float]]] = None # List of [x, y] polygon points
    mask_reference: Optional[str] = None # Path to mask image if saved

    # Geometric pixel measurements
    area_pixels: float
    perimeter_pixels: float
    width_pixels: float
    length_pixels: float
    aspect_ratio: float
    circularity: float
    centroid: List[float] # [cx, cy]
    bounding_box_area: float
    mask_area_ratio: float
    road_area_ratio_pct: float

    # Physical measurements (Never fabricated)
    is_calibrated: bool = False
    physical_area_m2: Optional[float] = None
    physical_width_m: Optional[float] = None
    physical_length_m: Optional[float] = None
    physical_depth_m: Optional[float] = None

    # UI Display Strings
    display_area: str
    display_width: str
    display_length: str
    display_depth: str
    depth_status: str # "Relative estimate" or "Calibrated"
    relative_depth_index: float # 0.0 to 1.0

    # Severity & Engineering Assessment
    severity: str # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    risk_level: str
    severity_score: float # 0 to 100
    possible_factors: List[str]
    recommendations: List[str]
    explainability: Dict[str, Any] = Field(default_factory=dict)
