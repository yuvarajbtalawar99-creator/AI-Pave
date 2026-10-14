"""
AI-PAVE Severity & Road Condition Engine
Applies transparent, measurable rules loaded from configs/severity_rules.yaml.
Assesses overall road condition and identifies visual indicators for possible contributing factors.
"""

from typing import Dict, Any, List, Tuple
import numpy as np
import cv2
from app.core.config import settings

class SeverityService:
    def __init__(self):
        self.rules = settings.load_severity_rules()

    def assess_pothole_severity(
        self,
        measurement: Dict[str, Any],
        relative_depth_index: float,
        confidence: float,
        image_dims: Tuple[int, int]
    ) -> Dict[str, Any]:
        """
        Calculates composite severity score [0 - 100] and maps to
        LOW, MEDIUM, HIGH, or CRITICAL.
        """
        weights = self.rules.get("scoring_weights", {
            "area_weight": 0.35,
            "depth_weight": 0.35,
            "aspect_ratio_weight": 0.10,
            "location_weight": 0.10,
            "confidence_weight": 0.10
        })

        # Normalized inputs:
        # Area: capped at 5% of road frame
        road_pct = measurement.get("road_area_ratio_pct", 0.0)
        norm_area = min(1.0, road_pct / 5.0)

        # Depth index [0.0 - 1.0]
        norm_depth = float(np.clip(relative_depth_index, 0.0, 1.0))

        # Aspect ratio deviation from circular (irregular shapes indicate severe edge fracture)
        circ = measurement.get("circularity", 0.8)
        norm_shape = 1.0 - min(1.0, circ)

        # Centroid location: lower half of frame indicates direct vehicle trajectory impact
        w_img, h_img = image_dims
        cy = measurement.get("centroid", [0, 0])[1]
        norm_loc = min(1.0, cy / max(1.0, float(h_img)))

        # Composite score calculation
        score = (
            weights.get("area_weight", 0.35) * norm_area +
            weights.get("depth_weight", 0.35) * norm_depth +
            weights.get("aspect_ratio_weight", 0.10) * norm_shape +
            weights.get("location_weight", 0.10) * norm_loc +
            weights.get("confidence_weight", 0.10) * confidence
        ) * 100.0

        score = round(float(np.clip(score, 0.0, 100.0)), 1)

        # Threshold evaluation
        levels = self.rules.get("levels", {})
        crit_cfg = levels.get("critical", {"min_composite_score": 75.0})
        high_cfg = levels.get("high", {"min_composite_score": 50.0})
        med_cfg = levels.get("medium", {"min_composite_score": 25.0})

        # Also check direct physical/override criteria if calibrated
        is_calibrated = measurement.get("is_calibrated", False)
        phys_area = measurement.get("physical_area_m2") or 0.0
        phys_depth_cm = (measurement.get("physical_depth_m") or 0.0) * 100.0

        if score >= crit_cfg.get("min_composite_score", 75.0) or (is_calibrated and (phys_area > 0.25 or phys_depth_cm > 7.5)):
            severity = "CRITICAL"
            risk = "CRITICAL"
            urgency = crit_cfg.get("urgency", "Immediate (Within 24-48 hours)")
        elif score >= high_cfg.get("min_composite_score", 50.0) or (is_calibrated and (phys_area > 0.10 or phys_depth_cm > 4.5)):
            severity = "HIGH"
            risk = "HIGH"
            urgency = high_cfg.get("urgency", "High Priority (Within 3-7 days)")
        elif score >= med_cfg.get("min_composite_score", 25.0) or (is_calibrated and (phys_area > 0.04 or phys_depth_cm > 2.5)):
            severity = "MEDIUM"
            risk = "MEDIUM"
            urgency = med_cfg.get("urgency", "Scheduled Maintenance (Within 2-4 weeks)")
        else:
            severity = "LOW"
            risk = "LOW"
            urgency = "Routine Monitoring"

        return {
            "severity": severity,
            "risk_level": risk,
            "severity_score": score,
            "urgency": urgency,
            "explainability": {
                "composite_score": score,
                "area_contribution": round(norm_area * 100.0, 1),
                "depth_contribution": round(norm_depth * 100.0, 1),
                "shape_irregularity": round(norm_shape * 100.0, 1),
                "road_coverage_pct": road_pct
            }
        }

    def detect_possible_contributing_factors(
        self,
        image_bgr: np.ndarray,
        bbox: list,
        polygon_pts: np.ndarray
    ) -> List[str]:
        """
        Detects visual surface distress cues around pothole.
        Explicitly marked as 'Possible contributing factors', never guaranteed cause.
        """
        factors = []
        x1, y1, x2, y2 = [int(v) for v in bbox]
        h, w = image_bgr.shape[:2]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        if x2 <= x1 or y2 <= y1:
            return ["Localized surface wear"]

        roi = image_bgr[y1:y2, x1:x2]
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

        # 1. Check for water accumulation (very low reflectance / dark specular pooling)
        mean_lum = float(np.mean(gray_roi))
        min_lum = float(np.min(gray_roi))
        if min_lum < 35 and mean_lum < 75:
            factors.append("Possible water accumulation / moisture entrapment in base")

        # 2. Check for surrounding edge cracking (Canny edge density)
        edges = cv2.Canny(gray_roi, 50, 150)
        edge_density = float(np.count_nonzero(edges) / max(1, edges.size))
        if edge_density > 0.12:
            factors.append("Surrounding fatigue cracking / edge ravelling")

        # 3. Check for boundary irregularity (shear / fracturing)
        c_pts = np.array(polygon_pts, dtype=np.int32).reshape((-1, 1, 2))
        perim = float(cv2.arcLength(c_pts, closed=True))
        area = float(cv2.contourArea(c_pts))
        if area > 0:
            circ = (4.0 * np.pi * area) / (perim ** 2)
            if circ < 0.5:
                factors.append("Irregular edge deterioration and spalling")

        # 4. Color variance / aged patch breakdown
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        val_channel = hsv[:, :, 2]
        variance = float(np.var(val_channel))
        if variance > 1200:
            factors.append("Surface deformation and asphalt texture heterogeneity")

        if not factors:
            factors.append("Pavement surface wear and repetitive traffic loading")

        return factors

    def calculate_overall_road_condition(
        self,
        potholes: List[Dict[str, Any]],
        image_dims: Tuple[int, int]
    ) -> Tuple[str, str, Dict[str, int]]:
        """
        Classifies overall segment condition into Good, Fair, Poor, or Severely Damaged.
        Explicitly indicates: 'Rule-based assessment'.
        """
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for p in potholes:
            sev = p.get("severity", "LOW")
            if sev in counts:
                counts[sev] += 1

        total = len(potholes)
        if total == 0:
            # Rule Phase I: Do not label Good solely because the model returned zero detections.
            return "No Potholes Detected", "Rule-based assessment (0 detections)", counts

        if counts["CRITICAL"] > 0 or counts["HIGH"] >= 2 or total >= 5:
            condition = "Severely Damaged"
        elif counts["HIGH"] > 0 or counts["MEDIUM"] >= 2 or total >= 3:
            condition = "Poor"
        elif counts["MEDIUM"] > 0 or total >= 1:
            condition = "Fair"
        else:
            condition = "Minor Distress"

        return condition, "Rule-based assessment", counts

severity_service = SeverityService()
