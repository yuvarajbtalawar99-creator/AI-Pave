"""
AI-PAVE Database Layer
Manages MongoDB connections with automatic fallback to local JSON document store
if MongoDB service is temporarily unreachable, ensuring seamless testing and resilience.
"""

import json
from pathlib import Path
from typing import Optional, Dict, Any, List
import pymongo
from pymongo import MongoClient
from app.core.config import settings
from app.core.logging import logger

class DatabaseManager:
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_connected = False
        self.fallback_file = settings.BASE_DIR / "artifacts" / "db_store.json"
        self._init_connection()

    def _init_connection(self):
        try:
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1500)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info("Connected to MongoDB successfully", uri=settings.MONGODB_URI, db=settings.DATABASE_NAME)
        except Exception as e:
            self.is_connected = False
            self.db = None
            logger.warning("MongoDB not active. Using persistent local document store fallback", error=str(e))
            self.fallback_file.parent.mkdir(parents=True, exist_ok=True)
            if not self.fallback_file.exists():
                with open(self.fallback_file, "w") as f:
                    json.dump({"analyses": [], "users": [], "system_logs": [], "model_runs": []}, f)

    def get_collection(self, collection_name: str):
        if self.is_connected and self.db is not None:
            return self.db[collection_name]
        return None

db_manager = DatabaseManager()
