"""
AI-PAVE Postprocessing and Visualization Engine
Renders detection bounding boxes, segmentation masks, depth topographic maps,
and multi-layer composite inspection overlays.
"""

from typing import List, Dict, Any, Tuple
import cv2
import numpy as np

SEVERITY_COLORS_BGR = {
    "CRITICAL": (46, 47, 211),   # #d32f2f Red
    "HIGH": (2, 108, 237),       # #ed6c02 Orange
    "MEDIUM": (209, 136, 2),     # #0288d1 Cyan/Blue
    "LOW": (50, 125, 46)         # #2e7d32 Green
}

def render_detection_overlay(
    image: np.ndarray,
    potholes: List[Dict[str, Any]],
    show_labels: bool = True,
    show_confidence: bool = True
) -> np.ndarray:
    """Renders crisp engineering bounding boxes and metadata flags."""
    canvas = image.copy()
    for p in potholes:
        bbox = p.get("bbox", [0, 0, 0, 0])
        x1, y1, x2, y2 = [int(v) for v in bbox]
        p_id = p.get("pothole_id", 1)
        conf = p.get("confidence", 0.0)
        sev = p.get("severity", "MEDIUM")
        color = SEVERITY_COLORS_BGR.get(sev, (200, 200, 200))

        # Main box
        cv2.rectangle(canvas, (x1, y1), (x2, y2), color, thickness=2)

        # Label tag
        if show_labels:
            conf_str = f" ({conf*100:.1f}%)" if show_confidence else ""
            label_text = f"Pothole #{p_id}{conf_str} [{sev}]"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            thickness = 1
            (tw, th), baseline = cv2.getTextSize(label_text, font, font_scale, thickness)
            
            tag_y1 = max(0, y1 - th - 8)
            tag_y2 = y1
            cv2.rectangle(canvas, (x1, tag_y1), (x1 + tw + 10, tag_y2), color, -1)
            cv2.putText(canvas, label_text, (x1 + 5, tag_y2 - 4), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)

    return canvas

def render_segmentation_overlay(
    image: np.ndarray,
    potholes: List[Dict[str, Any]],
    alpha: float = 0.45
) -> np.ndarray:
    """Renders semi-transparent polygon segmentation masks with highlighted boundary."""
    canvas = image.copy()
    overlay = image.copy()

    for p in potholes:
        poly = p.get("polygon")
        if not poly or len(poly) < 3:
            continue
        sev = p.get("severity", "MEDIUM")
        color = SEVERITY_COLORS_BGR.get(sev, (200, 200, 200))
        pts = np.array(poly, dtype=np.int32).reshape((-1, 1, 2))

        # Fill polygon on overlay
        cv2.fillPoly(overlay, [pts], color)
        # Draw solid contour rim on canvas
        cv2.polylines(canvas, [pts], isClosed=True, color=color, thickness=2)

    cv2.addWeighted(overlay, alpha, canvas, 1 - alpha, 0, canvas)
    return canvas

def render_depth_colormap(depth_map: np.ndarray) -> np.ndarray:
    """Converts 2D float depth map [0, 1] into colorful topographic Turbo/Inferno colormap."""
    norm = np.clip(depth_map * 255.0, 0, 255).astype(np.uint8)
    colored = cv2.applyColorMap(norm, cv2.COLORMAP_TURBO)
    return colored

def render_combined_overlay(
    image: np.ndarray,
    potholes: List[Dict[str, Any]]
) -> np.ndarray:
    """Combines segmentation polygons and bounding boxes into master inspection view."""
    with_seg = render_segmentation_overlay(image, potholes, alpha=0.35)
    combined = render_detection_overlay(with_seg, potholes, show_labels=True, show_confidence=True)
    return combined
