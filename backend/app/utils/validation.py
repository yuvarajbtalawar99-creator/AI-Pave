"""
AI-PAVE Box and Coordinate Validation Utilities
"""

from typing import List, Tuple

def validate_normalized_bbox(xc: float, yc: float, w: float, h: float) -> bool:
    return (0.0 <= xc <= 1.0) and (0.0 <= yc <= 1.0) and (0.0 < w <= 1.0) and (0.0 < h <= 1.0)

def clamp_box_to_image(box: List[float], img_dims: Tuple[int, int]) -> List[float]:
    w, h = img_dims
    x1, y1, x2, y2 = box
    x1 = max(0.0, min(float(x1), float(w)))
    y1 = max(0.0, min(float(y1), float(h)))
    x2 = max(0.0, min(float(x2), float(w)))
    y2 = max(0.0, min(float(y2), float(h)))
    return [x1, y1, x2, y2]
