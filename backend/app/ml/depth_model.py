"""
AI-PAVE Monocular Depth Estimation Engine
Produces relative depth maps and calculates pavement depression index
comparing pothole interior against surrounding road baseline plane.
"""

from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional
import numpy as np
import cv2
from scipy.ndimage import gaussian_filter

class BaseDepthModel(ABC):
    @abstractmethod
    def predict_depth_map(self, rgb_image: np.ndarray) -> np.ndarray:
        """
        Produces normalized relative depth map [0.0 - 1.0] for the entire frame,
        where higher values represent greater distance/depression relative to camera.
        """
        pass

class MonocularDepthModel(BaseDepthModel):
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.is_loaded = True

    def predict_depth_map(self, rgb_image: np.ndarray) -> np.ndarray:
        """
        Generates relative depth map combining road perspective gradient
        and localized contrast depression.
        """
        h, w = rgb_image.shape[:2]
        gray = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2GRAY) if len(rgb_image.shape) == 3 else rgb_image
        
        # 1. Perspective baseline gradient (road surface recedes from bottom to top)
        y_coords = np.linspace(0, 1, h)[:, None]
        perspective_plane = np.tile(1.0 - y_coords, (1, w)) # 0 at bottom (nearest), 1 at horizon

        # 2. Localized depression cues: dark specularity, shadows, edge elevation drops
        # Pavement depressions cause local intensity attenuation and texture disruption
        inv_gray = 255.0 - gray.astype(np.float32)
        local_depression = gaussian_filter(inv_gray, sigma=7)
        local_norm = (local_depression - local_depression.min()) / (local_depression.max() - local_depression.min() + 1e-6)

        # 3. Composite relative depth map
        depth_map = 0.65 * perspective_plane + 0.35 * local_norm
        depth_map = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min() + 1e-6)
        return depth_map.astype(np.float32)

    def analyze_pothole_depth(
        self,
        depth_map: np.ndarray,
        polygon_pts: np.ndarray,
        img_dims: Tuple[int, int],
        calibration_scale_factor: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Calculates depression depth relative to the surrounding pavement plane.
        Compares interior pothole depth against an outer margin annulus.
        """
        w, h = img_dims
        mask_pothole = np.zeros((h, w), dtype=np.uint8)
        c_pts = np.array(polygon_pts, dtype=np.int32).reshape((-1, 1, 2))
        cv2.fillPoly(mask_pothole, [c_pts], 255)

        # Outer baseline ring: dialate pothole mask and subtract original mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        dilated = cv2.dilate(mask_pothole, kernel, iterations=2)
        surrounding_baseline_mask = cv2.subtract(dilated, mask_pothole)

        # Extract depth values
        interior_depths = depth_map[mask_pothole > 0]
        surrounding_depths = depth_map[surrounding_baseline_mask > 0]

        if len(interior_depths) == 0 or len(surrounding_depths) == 0:
            return {
                "relative_depth_index": 0.0,
                "display_depth": "Requires calibration",
                "depth_status": "Relative estimate",
                "is_calibrated": False,
                "physical_depth_m": None
            }

        median_interior = float(np.median(interior_depths))
        median_surrounding = float(np.median(surrounding_depths))

        # Depression index: relative contrast drop between rim and floor
        # Positive value indicates pothole floor is depressed below surrounding plane
        raw_diff = abs(median_interior - median_surrounding)
        depression_index = float(np.clip(raw_diff * 3.5, 0.0, 1.0))

        if calibration_scale_factor is not None and calibration_scale_factor > 0:
            # Calibrated physical estimate (e.g., using reference object or stereo baseline)
            # scale factor in meters per depth index unit
            physical_m = round(depression_index * calibration_scale_factor, 3)
            return {
                "relative_depth_index": round(depression_index, 3),
                "display_depth": f"{physical_m * 100:.1f} cm (Calibrated)",
                "depth_status": "Calibrated",
                "is_calibrated": True,
                "physical_depth_m": physical_m
            }
        else:
            # Uncalibrated: Strictly marked as Relative estimate per requirements
            rel_label = "Shallow" if depression_index < 0.3 else "Moderate" if depression_index < 0.6 else "Deep"
            return {
                "relative_depth_index": round(depression_index, 3),
                "display_depth": f"Relative estimate: {depression_index:.2f} ({rel_label})",
                "depth_status": "Relative estimate",
                "is_calibrated": False,
                "physical_depth_m": None
            }
