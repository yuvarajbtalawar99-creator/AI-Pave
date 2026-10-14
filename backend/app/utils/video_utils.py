"""
AI-PAVE Video Processing Utilities
"""

from pathlib import Path
from typing import Dict, Any, Generator, Tuple
import cv2
import numpy as np

def probe_video_metadata(video_path: Path) -> Dict[str, Any]:
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Failed to open video at {video_path}")
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = (frames / fps) if fps > 0 else 0.0
    cap.release()

    return {
        "width": width,
        "height": height,
        "fps": fps,
        "frame_count": frames,
        "duration_seconds": round(duration, 2)
    }

def extract_frames(video_path: Path, stride: int = 1) -> Generator[Tuple[int, np.ndarray], None, None]:
    cap = cv2.VideoCapture(str(video_path))
    idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if idx % stride == 0:
            yield idx, frame
        idx += 1
    cap.release()
