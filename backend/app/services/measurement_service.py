"""
AI-PAVE Measurement Engine
Computes precise geometric properties in pixel coordinates.
Applies physical conversion ONLY when valid camera calibration or physical scale factor is provided.
Never fabricates metric measurements from uncalibrated 2D monocular images.
"""

from typing import Dict, Any, Optional, Tuple
import numpy as np
import cv2

class MeasurementService:
    def __init__(self):
        pass

    def compute_pothole_measurements(
        self,
        polygon_pts: np.ndarray,
        bbox: list,
        image_dims: Tuple[int, int],
        calibration_scale_cm_per_px: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Calculates pixel dimensions, area, circularity, aspect ratio,
        and converts to metric dimensions only if calibration_scale_cm_per_px is provided.
        """
        w_img, h_img = image_dims
        c_pts = np.array(polygon_pts, dtype=np.int32).reshape((-1, 1, 2))

        # Geometric properties
        area_px = float(cv2.contourArea(c_pts))
        perimeter_px = float(cv2.arcLength(c_pts, closed=True))

        x1, y1, x2, y2 = bbox
        width_px = max(1.0, float(x2 - x1))
        length_px = max(1.0, float(y2 - y1))
        bbox_area = float(width_px * length_px)

        # Centroid
        M = cv2.moments(c_pts)
        if M["m00"] != 0:
            cx = float(M["m10"] / M["m00"])
            cy = float(M["m01"] / M["m00"])
        else:
            cx = (x1 + x2) / 2.0
            cy = (y1 + y2) / 2.0

        aspect_ratio = float(width_px / length_px)
        # Circularity = 4 * pi * Area / (Perimeter^2)
        circularity = (4.0 * np.pi * area_px) / (perimeter_px ** 2) if perimeter_px > 0 else 0.0
        mask_area_ratio = float(area_px / bbox_area) if bbox_area > 0 else 0.0
        total_road_px = float(w_img * h_img)
        road_area_ratio_pct = float((area_px / total_road_px) * 100.0)

        # Physical calculation check
        is_calibrated = (calibration_scale_cm_per_px is not None and calibration_scale_cm_per_px > 0)

        if is_calibrated:
            scale_m_per_px = calibration_scale_cm_per_px / 100.0
            physical_w_m = round(width_px * scale_m_per_px, 3)
            physical_l_m = round(length_px * scale_m_per_px, 3)
            # Area in m^2 = area_px * (m_per_px)^2
            physical_area_m2 = round(area_px * (scale_m_per_px ** 2), 4)

            display_width = f"{physical_w_m:.2f} m"
            display_length = f"{physical_l_m:.2f} m"
            display_area = f"{physical_area_m2:.3f} m²"
        else:
            physical_w_m = None
            physical_l_m = None
            physical_area_m2 = None

            # Transparent non-fabricated display strings
            display_width = f"{int(width_px)} px (Requires calibration)"
            display_length = f"{int(length_px)} px (Requires calibration)"
            display_area = f"{int(area_px)} px² (Requires calibration)"

        return {
            "area_pixels": round(area_px, 1),
            "perimeter_pixels": round(perimeter_px, 1),
            "width_pixels": round(width_px, 1),
            "length_pixels": round(length_px, 1),
            "aspect_ratio": round(aspect_ratio, 3),
            "circularity": round(circularity, 3),
            "centroid": [round(cx, 1), round(cy, 1)],
            "bounding_box_area": round(bbox_area, 1),
            "mask_area_ratio": round(mask_area_ratio, 3),
            "road_area_ratio_pct": round(road_area_ratio_pct, 3),
            
            # Physical
            "is_calibrated": is_calibrated,
            "physical_area_m2": physical_area_m2,
            "physical_width_m": physical_w_m,
            "physical_length_m": physical_l_m,
            "display_width": display_width,
            "display_length": display_length,
            "display_area": display_area
        }

measurement_service = MeasurementService()
