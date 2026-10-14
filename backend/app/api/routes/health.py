"""
AI-PAVE Health & System Info Endpoints
"""

import sys
import platform
import psutil
import torch
from fastapi import APIRouter
from app.core.config import settings
from app.database.mongodb import db_manager

router = APIRouter()

@router.get("/health")
def get_health():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "database": "connected" if db_manager.is_connected else "fallback_store_active",
        "gpu_available": torch.cuda.is_available(),
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }

@router.get("/system/info")
def get_system_info():
    mem = psutil.virtual_memory()
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "processor": platform.processor(),
        "cpu_count": psutil.cpu_count(logical=True),
        "total_memory_gb": round(mem.total / (1024**3), 2),
        "available_memory_gb": round(mem.available / (1024**3), 2),
        "torch_version": torch.__version__,
        "cuda_available": torch.cuda.is_available(),
        "cuda_device_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
        "database_backend": "MongoDB" if db_manager.is_connected else "Local File Store (Fallback)"
    }
