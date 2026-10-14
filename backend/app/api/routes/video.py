"""
AI-PAVE Video Analysis API Endpoints
"""

import shutil
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status

from app.core.config import settings
from app.core.security import validate_video_upload, generate_secure_filename
from app.services.video_service import video_service
from app.database.repositories.analysis_repo import analysis_repo
from app.schemas.analysis import AnalysisResponse

router = APIRouter()

@router.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(
    file: UploadFile = File(...),
    confidence_threshold: float = Form(0.25),
    iou_threshold: float = Form(0.45),
    frame_stride: int = Form(2)
):
    """
    Upload road video, extract frames, detect & segment potholes,
    track defects across frames to eliminate duplicates, and reconstruct annotated video.
    """
    validate_video_upload(file, max_size_mb=settings.MAX_VIDEO_SIZE_MB)

    unique_id, secure_filename = generate_secure_filename(file.filename or "road_video.mp4")
    upload_dir = settings.get_upload_path()
    save_path = upload_dir / secure_filename

    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist uploaded video: {str(e)}"
        )

    try:
        summary_doc = video_service.process_video(
            video_path=save_path,
            analysis_id=unique_id,
            original_filename=file.filename or secure_filename,
            conf_threshold=confidence_threshold,
            iou_threshold=iou_threshold,
            frame_sample_rate=frame_stride
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video tracking pipeline failed: {str(e)}"
        )

    analysis_repo.save(summary_doc)
    return summary_doc
