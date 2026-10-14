"""
AI-PAVE User Repository
Encapsulates CRUD operations on MongoDB users collection with local JSON document store fallback.
"""

import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database.mongodb import db_manager
from app.core.logging import logger

class UserRepository:
    def __init__(self):
        self.collection_name = "users"

    def _read_full_fallback(self) -> Dict[str, Any]:
        try:
            if db_manager.fallback_file.exists():
                with open(db_manager.fallback_file, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        return {"analyses": [], "users": [], "system_logs": [], "model_runs": []}

    def _read_fallback_users(self) -> List[Dict[str, Any]]:
        data = self._read_full_fallback()
        return data.get("users", [])

    def _write_fallback_users(self, users: List[Dict[str, Any]]):
        try:
            data = self._read_full_fallback()
            data["users"] = users
            db_manager.fallback_file.parent.mkdir(parents=True, exist_ok=True)
            with open(db_manager.fallback_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error("Failed to write to fallback database store for users", error=str(e))

    def save(self, user_doc: Dict[str, Any]) -> str:
        user_id = user_doc["user_id"]
        # Normalize email to lower case
        if "email" in user_doc and user_doc["email"]:
            user_doc["email"] = user_doc["email"].strip().lower()

        if db_manager.is_connected and db_manager.db is not None:
            col = db_manager.get_collection(self.collection_name)
            doc_to_save = dict(user_doc)
            col.update_one({"user_id": user_id}, {"$set": doc_to_save}, upsert=True)
        else:
            users = self._read_fallback_users()
            filtered = [u for u in users if u.get("user_id") != user_id]
            filtered.insert(0, user_doc)
            self._write_fallback_users(filtered)
        return user_id

    def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            col = db_manager.get_collection(self.collection_name)
            res = col.find_one({"user_id": user_id}, {"_id": 0})
            return res
        else:
            users = self._read_fallback_users()
            for u in users:
                if u.get("user_id") == user_id:
                    return u
            return None

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        normalized = email.strip().lower()
        if db_manager.is_connected and db_manager.db is not None:
            col = db_manager.get_collection(self.collection_name)
            res = col.find_one({"email": normalized}, {"_id": 0})
            return res
        else:
            users = self._read_fallback_users()
            for u in users:
                if u.get("email", "").lower() == normalized:
                    return u
            return None

    def get_by_google_id(self, google_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            col = db_manager.get_collection(self.collection_name)
            res = col.find_one({"google_id": google_id}, {"_id": 0})
            return res
        else:
            users = self._read_fallback_users()
            for u in users:
                if u.get("google_id") == google_id:
                    return u
            return None

    def update(self, user_id: str, updates: Dict[str, Any]) -> bool:
        if db_manager.is_connected and db_manager.db is not None:
            col = db_manager.get_collection(self.collection_name)
            res = col.update_one({"user_id": user_id}, {"$set": updates})
            return res.matched_count > 0
        else:
            users = self._read_fallback_users()
            for i, u in enumerate(users):
                if u.get("user_id") == user_id:
                    users[i] = {**u, **updates}
                    self._write_fallback_users(users)
                    return True
            return False

user_repo = UserRepository()
