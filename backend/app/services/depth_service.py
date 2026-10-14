"""
AI-PAVE Depth Service Wrapper
Exposes depth estimation routines and profile analysis.
"""

from app.ml.depth_model import MonocularDepthModel

class DepthService:
    def __init__(self):
        self.model = MonocularDepthModel()

    def generate_depth_map(self, image):
        return self.model.predict_depth_map(image)

    def analyze_pothole_depth(self, depth_map, polygon_pts, img_dims, scale_factor=None):
        return self.model.analyze_pothole_depth(depth_map, polygon_pts, img_dims, scale_factor)

depth_service = DepthService()
