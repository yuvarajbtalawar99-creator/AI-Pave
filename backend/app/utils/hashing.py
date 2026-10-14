"""
AI-PAVE File Checksum and Perceptual Hashing Utilities
"""

import hashlib
from pathlib import Path
from PIL import Image
import numpy as np

def compute_file_md5(file_path: Path) -> str:
    hasher = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

def compute_perceptual_dhash(image_path: Path, hash_size: int = 8) -> int:
    try:
        with Image.open(image_path) as img:
            img = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
            pixels = np.array(img, dtype=np.float32)
            diff = pixels[:, 1:] > pixels[:, :-1]
            val = 0
            for idx, b in enumerate(diff.flatten()):
                if b:
                    val |= (1 << idx)
            return val
    except Exception:
        return 0

def compute_hash_distance(h1: int, h2: int) -> int:
    return bin(h1 ^ h2).count("1")
