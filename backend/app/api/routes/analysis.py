"""
AI-PAVE Image Analysis API Endpoints
"""

import shutil
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.security import validate_image_upload, generate_secure_filename
from app.services.detection_service import detection_service
from app.database.repositories.analysis_repo import analysis_repo
from app.schemas.analysis import AnalysisResponse, AnalysisListItem, DashboardStats

router = APIRouter()

@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    confidence_threshold: float = Form(0.25),
    iou_threshold: float = Form(0.45),
    calibration_scale_cm_per_px: Optional[float] = Form(None)
):
    """
    Upload road image, perform pothole detection, segmentation, depth estimation,
    geometric measurement, severity scoring, and maintenance recommendation.
    """
    # Security & format validation
    validate_image_upload(file, max_size_mb=settings.MAX_IMAGE_SIZE_MB)

    # Save to disk with unique ID
    unique_id, secure_filename = generate_secure_filename(file.filename or "road_image.jpg")
    upload_dir = settings.get_upload_path()
    save_path = upload_dir / secure_filename

    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist uploaded image: {str(e)}"
        )

    # Process image
    try:
        result_doc = detection_service.process_image(
            image_path=save_path,
            analysis_id=unique_id,
            original_filename=file.filename or secure_filename,
            conf_threshold=confidence_threshold,
            iou_threshold=iou_threshold,
            calibration_scale_cm_per_px=calibration_scale_cm_per_px
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline execution error: {str(e)}"
        )

    # Persist in MongoDB
    analysis_repo.save(result_doc)

    return result_doc

@router.get("/analyses", response_model=List[AnalysisListItem])
def list_analyses(skip: int = 0, limit: int = 50):
    records = analysis_repo.get_all(skip=skip, limit=limit)
    items = []
    for r in records:
        high_sev = sum(1 for p in r.get("potholes", []) if p.get("severity") in ["HIGH", "CRITICAL"])
        items.append({
            "analysis_id": r["analysis_id"],
            "file_name": r.get("file_name", "Unknown"),
            "file_type": r.get("file_type", "image"),
            "model_version": r.get("model_version", "v1"),
            "created_at": r.get("created_at", ""),
            "processing_time_ms": r.get("processing_time_ms", 0.0),
            "pothole_count": r.get("pothole_count", 0),
            "overall_condition": r.get("overall_condition", "Good"),
            "high_severity_count": high_sev,
            "average_confidence": r.get("average_confidence", 0.0),
            "thumbnail_url": r.get("annotated_media_url")
        })
    return items

@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str):
    res = analysis_repo.get_by_id(analysis_id)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")
    
    # Auto-generate evaluation metrics and sklearn plots if missing
    if not res.get("evaluation"):
        try:
            from app.services.evaluation_plot_service import evaluation_plot_service
            res["evaluation"] = evaluation_plot_service.generate_evaluation_for_analysis(res)
            analysis_repo.save(res)
        except Exception:
            pass

    return res

@router.delete("/analysis/{analysis_id}")
def delete_analysis(analysis_id: str):
    deleted = analysis_repo.delete(analysis_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    return {"status": "SUCCESS", "analysis_id": analysis_id}

@router.get("/analysis/{analysis_id}/report.pdf")
def download_pdf_report(analysis_id: str):
    pdf_path = settings.get_reports_path() / f"{analysis_id}.pdf"
    if not pdf_path.exists():
        # Regenerate if missing
        res = analysis_repo.get_by_id(analysis_id)
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")
        from app.services.report_service import report_service
        report_service.generate_pdf_report(res)

    return FileResponse(
        str(pdf_path),
        media_type="application/pdf",
        filename=f"AI-PAVE-Report-{analysis_id}.pdf"
    )

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    return analysis_repo.get_dashboard_metrics()
