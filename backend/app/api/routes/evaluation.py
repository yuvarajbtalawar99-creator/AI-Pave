"""
AI-PAVE Model Evaluation & Error Analysis Endpoints
Reads real, non-fabricated metrics from artifacts/evaluation/.
"""

import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from app.core.config import settings

router = APIRouter()

@router.get("/evaluation")
def get_evaluation_metrics():
    eval_dir = settings.get_eval_path()
    metrics_file = eval_dir / "metrics.json"
    dataset_report_file = eval_dir / "dataset_report.json"
    error_analysis_file = eval_dir / "error_analysis.json"

    metrics_data = {}
    if metrics_file.exists():
        try:
            with open(metrics_file, "r") as f:
                metrics_data = json.load(f)
        except Exception:
            pass

    dataset_summary = {}
    if dataset_report_file.exists():
        try:
            with open(dataset_report_file, "r") as f:
                dataset_summary = json.load(f)
        except Exception:
            pass

    error_analysis = {}
    if error_analysis_file.exists():
        try:
            with open(error_analysis_file, "r") as f:
                error_analysis = json.load(f)
        except Exception:
            pass

    return {
        "evaluation_metrics": metrics_data,
        "dataset_integrity": dataset_summary,
        "error_analysis": error_analysis,
        "charts": {
            "confusion_matrix_url": "/api/v1/evaluation/charts/confusion_matrix.png",
            "pr_curve_url": "/api/v1/evaluation/charts/pr_curve.png"
        }
    }

@router.get("/evaluation/charts/{chart_name}")
def get_chart_image(chart_name: str):
    eval_dir = settings.get_eval_path()
    chart_file = eval_dir / chart_name
    if not chart_file.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")
    return FileResponse(str(chart_file), media_type="image/png")
