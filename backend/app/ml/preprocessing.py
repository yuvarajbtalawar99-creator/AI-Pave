"""
AI-PAVE Preprocessing Engine
Standardizes image tensors, color space conversions, and geometric resizing.
"""

from typing import Tuple
import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_input, target_size: Tuple[int, int] = (640, 640)) -> Tuple[np.ndarray, np.ndarray, float, Tuple[int, int]]:
    """
    Accepts image path, PIL image, or numpy array.
    Returns:
    - original_bgr: uint8 BGR image
    - resized_rgb: normalized RGB image sized for neural inference
    - scale_ratio: float ratio
    - (orig_w, orig_h): original dimensions
    """
    if isinstance(image_input, (str, bytes)):
        orig_bgr = cv2.imread(str(image_input))
        if orig_bgr is None:
            raise ValueError(f"Failed to read image from {image_input}")
    elif isinstance(image_input, Image.Image):
        orig_rgb = np.array(image_input)
        orig_bgr = cv2.cvtColor(orig_rgb, cv2.COLOR_RGB2BGR)
    elif isinstance(image_input, np.ndarray):
        orig_bgr = image_input.copy()
    else:
        raise TypeError(f"Unsupported image input type {type(image_input)}")

    orig_h, orig_w = orig_bgr.shape[:2]

    # Resize preserving aspect ratio or direct square for YOLO
    resized_bgr = cv2.resize(orig_bgr, target_size, interpolation=cv2.INTER_LINEAR)
    resized_rgb = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2RGB)

    scale_ratio = float(min(target_size[0] / orig_w, target_size[1] / orig_h))
    return orig_bgr, resized_rgb, scale_ratio, (orig_w, orig_h)
