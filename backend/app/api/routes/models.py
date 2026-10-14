"""
AI-PAVE Model Management Endpoints
"""

import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from app.core.config import settings

router = APIRouter()

@router.get("/models")
def get_models():
    registry = settings.load_model_registry()
    
    # Try reading real trained checkpoint metadata
    meta_path = settings.BASE_DIR / "artifacts" / "models" / "detector_metadata.json"
    trained_meta = {}
    if meta_path.exists():
        try:
            with open(meta_path, "r") as f:
                trained_meta = json.load(f)
        except Exception:
            pass

    return {
        "active_models": registry.get("active_models", {}),
        "available_models": registry.get("available_models", []),
        "latest_training_metadata": trained_meta
    }

@router.get("/models/{model_id}")
def get_model_details(model_id: str):
    registry = settings.load_model_registry()
    available = registry.get("available_models", [])
    for m in available:
        if m.get("id") == model_id:
            return m
    
    # Check active models
    active = registry.get("active_models", {})
    if model_id in active:
        return active[model_id]

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Model with ID '{model_id}' not found in registry"
    )
