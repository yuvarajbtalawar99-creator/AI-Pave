"""
AI-PAVE Image Processing Utilities
"""

from pathlib import Path
from typing import Tuple, Optional
import cv2
import numpy as np

def load_image_bgr(path: Path) -> np.ndarray:
    img = cv2.imread(str(path))
    if img is None:
        raise ValueError(f"Failed to load image from {path}")
    return img

def save_image_bgr(path: Path, image: np.ndarray, quality: int = 95) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ext = path.suffix.lower()
    if ext in [".jpg", ".jpeg"]:
        cv2.imwrite(str(path), image, [cv2.IMWRITE_JPEG_QUALITY, quality])
    else:
        cv2.imwrite(str(path), image)

def resize_maintain_aspect(image: np.ndarray, target_width: int) -> np.ndarray:
    h, w = image.shape[:2]
    scale = target_width / float(w)
    new_h = int(h * scale)
    return cv2.resize(image, (target_width, new_h), interpolation=cv2.INTER_AREA)
