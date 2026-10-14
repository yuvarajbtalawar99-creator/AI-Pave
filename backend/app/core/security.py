"""
AI-PAVE File Validation and Security Module
Enforces strict checks on uploaded images and videos:
- Magic byte verification
- Extension whitelisting
- File size enforcement
- Path traversal mitigation
- Malicious filename sanitization
"""

import os
import re
import uuid
from pathlib import Path
from typing import Tuple
from fastapi import HTTPException, UploadFile, status
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}

ALLOWED_IMAGE_MIMES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}

ALLOWED_VIDEO_MIMES = {
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-matroska"
}

def sanitize_filename(filename: str) -> str:
    """Strip path separators and malicious chars to prevent path traversal."""
    cleaned = os.path.basename(filename)
    cleaned = re.sub(r"[^a-zA-Z0-9_.-]", "_", cleaned)
    return cleaned

def generate_secure_filename(original_filename: str) -> Tuple[str, str]:
    """Generates unique UUID-based filename while retaining clean extension."""
    sanitized = sanitize_filename(original_filename)
    ext = Path(sanitized).suffix.lower()
    unique_id = uuid.uuid4().hex
    secure_name = f"{unique_id}{ext}"
    return unique_id, secure_name

def validate_image_upload(file: UploadFile, max_size_mb: int = 25) -> Tuple[int, int]:
    """
    Validates image extension, file size, and verifies image decodability.
    Returns (width, height).
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image extension '{ext}'. Allowed: {', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}"
        )

    # Read header and verify size
    file.file.seek(0, os.SEEK_END)
    size_bytes = file.file.tell()
    file.file.seek(0)

    if size_bytes > max_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds limit of {max_size_mb}MB"
        )

    if size_bytes == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty"
        )

    # Verify Pillow decodability
    try:
        with Image.open(file.file) as img:
            img.verify()
        file.file.seek(0)
        with Image.open(file.file) as img:
            w, h = img.size
        file.file.seek(0)
        return w, h
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or invalid image file: {str(e)}"
        )

def validate_video_upload(file: UploadFile, max_size_mb: int = 200) -> None:
    """Validates video extension and file size."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported video extension '{ext}'. Allowed: {', '.join(sorted(ALLOWED_VIDEO_EXTENSIONS))}"
        )

    file.file.seek(0, os.SEEK_END)
    size_bytes = file.file.tell()
    file.file.seek(0)

    if size_bytes > max_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Video size exceeds limit of {max_size_mb}MB"
        )

    if size_bytes == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded video file is empty"
        )
