"""
AI-PAVE Main FastAPI Application Entrypoint
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.api.routes import health, analysis, video, models, evaluation, auth

# Initialize structured logging
setup_logging()

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AI-PAVE Backend Service Initialized", version=settings.PROJECT_VERSION)
    settings.get_upload_path()
    settings.get_output_path()
    settings.get_reports_path()
    settings.get_eval_path()
    yield

app = FastAPI(
    title="AI-PAVE API",
    description="AI-Based Pothole Detection, Measurement, Severity Assessment and Road Maintenance Recommendation System",
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Supports localhost:5173, etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media mounts
uploads_path = settings.get_upload_path()
processed_path = settings.get_output_path()
app.mount("/api/v1/media/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")
app.mount("/api/v1/media/processed", StaticFiles(directory=str(processed_path)), name="processed")

# Register API routes
app.include_router(auth.router, prefix=settings.API_V1_PREFIX, tags=["Authentication"])
app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health & System"])
app.include_router(analysis.router, prefix=settings.API_V1_PREFIX, tags=["Image Analysis"])
app.include_router(video.router, prefix=settings.API_V1_PREFIX, tags=["Video Analysis"])
app.include_router(models.router, prefix=settings.API_V1_PREFIX, tags=["Model Registry"])
app.include_router(evaluation.router, prefix=settings.API_V1_PREFIX, tags=["Evaluation & Benchmarks"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
