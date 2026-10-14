"""
AI-PAVE Backend Configuration Module
"""

import os
from pathlib import Path
from typing import List, Optional
import yaml
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-PAVE"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent
    
    # Storage
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "processed"
    REPORTS_DIR: str = "reports"
    EVALUATION_DIR: str = "artifacts/evaluation"
    
    # Limits
    MAX_IMAGE_SIZE_MB: int = 25
    MAX_VIDEO_SIZE_MB: int = 200
    
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "aipave_db"
    
    # ML Defaults
    CONFIDENCE_THRESHOLD: float = 0.25
    IOU_THRESHOLD: float = 0.45
    DEVICE: str = "auto"
    USE_HALF_PRECISION: bool = False
    
    # Model Weights
    MODEL_PATH: str = "artifacts/models/pothole_detector_yolo.pt"
    SEGMENTER_PATH: str = "artifacts/models/pothole_segmenter_yolo.pt"
    DEPTH_MODEL_PATH: str = "artifacts/models/depth_anything_v2.pt"

    # Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # Authentication & Google OAuth
    JWT_SECRET_KEY: str = "aipave-jwt-secret-key-production-ready-2026-road-inspection"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    model_config = {"env_file": ".env", "extra": "ignore"}

    def get_upload_path(self) -> Path:
        p = self.BASE_DIR / self.UPLOAD_DIR
        p.mkdir(parents=True, exist_ok=True)
        return p

    def get_output_path(self) -> Path:
        p = self.BASE_DIR / self.OUTPUT_DIR
        p.mkdir(parents=True, exist_ok=True)
        return p

    def get_reports_path(self) -> Path:
        p = self.BASE_DIR / self.REPORTS_DIR
        p.mkdir(parents=True, exist_ok=True)
        return p

    def get_eval_path(self) -> Path:
        p = self.BASE_DIR / self.EVALUATION_DIR
        p.mkdir(parents=True, exist_ok=True)
        return p

    def load_severity_rules(self) -> dict:
        rules_path = self.BASE_DIR / "configs" / "severity_rules.yaml"
        if rules_path.exists():
            with open(rules_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f)
        return {}

    def load_model_registry(self) -> dict:
        registry_path = self.BASE_DIR / "models" / "registry.yaml"
        if registry_path.exists():
            with open(registry_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f)
        return {}

settings = Settings()
