"""
AI-PAVE Computer Vision Evaluation Metric Utilities
"""

from typing import List
import numpy as np

def calculate_box_iou(b1: List[float], b2: List[float]) -> float:
    x1 = max(b1[0], b2[0])
    y1 = max(b1[1], b2[1])
    x2 = min(b1[2], b2[2])
    y2 = min(b1[3], b2[3])

    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    a1 = (b1[2] - b1[0]) * (b1[3] - b1[1])
    a2 = (b2[2] - b2[0]) * (b2[3] - b2[1])
    union = a1 + a2 - inter
    return inter / union if union > 0 else 0.0

def calculate_dice_score(iou: float) -> float:
    return (2.0 * iou) / (1.0 + iou) if (1.0 + iou) > 0 else 0.0

def calculate_f1(precision: float, recall: float) -> float:
    return (2.0 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
