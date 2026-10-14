"""
AI-PAVE Segmentation Service Wrapper
Exposes instance segmentation routines and polygon extraction.
"""

from app.ml.segmenter import YOLOSegmenter
from app.core.config import settings

class SegmentationService:
    def __init__(self):
        seg_path = str(settings.BASE_DIR / settings.SEGMENTER_PATH)
        self.model = YOLOSegmenter(seg_path, device=settings.DEVICE)

    def extract_segments(self, image, boxes=None, conf=0.25, iou=0.45):
        return self.model.segment(image, boxes=boxes, conf_threshold=conf, iou_threshold=iou)

segmentation_service = SegmentationService()
