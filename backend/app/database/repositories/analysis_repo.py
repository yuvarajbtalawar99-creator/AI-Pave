"""
AI-PAVE Analysis Repository
Encapsulates CRUD operations on MongoDB analyses collection with local store fallback.
"""

import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database.mongodb import db_manager
from app.core.logging import logger

class AnalysisRepository:
    def __init__(self):
        self.collection_name = "analyses"

    def _read_fallback(self) -> List[Dict[str, Any]]:
        try:
            if db_manager.fallback_file.exists():
                with open(db_manager.fallback_file, "r") as f:
                    data = json.load(f)
                    return data.get("analyses", [])
        except Exception:
            pass
        return []

    def _write_fallback(self, analyses: List[Dict[str, Any]]):
        try:
            data = {"analyses": analyses}
            with open(db_manager.fallback_file, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error("Failed to write to fallback database store", error=str(e))

    def save(self, doc: Dict[str, Any]) -> str:
        analysis_id = doc["analysis_id"]
        if db_manager.is_connected:
            col = db_manager.get_collection(self.collection_name)
            # Remove MongoDB internal _id if present in doc copy
            doc_to_save = dict(doc)
            col.update_one({"analysis_id": analysis_id}, {"$set": doc_to_save}, upsert=True)
        else:
            analyses = self._read_fallback()
            # Check existing
            filtered = [a for a in analyses if a.get("analysis_id") != analysis_id]
            filtered.insert(0, doc)
            self._write_fallback(filtered)
        return analysis_id

    def get_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected:
            col = db_manager.get_collection(self.collection_name)
            res = col.find_one({"analysis_id": analysis_id}, {"_id": 0})
            return res
        else:
            analyses = self._read_fallback()
            for a in analyses:
                if a.get("analysis_id") == analysis_id:
                    return a
            return None

    def get_all(self, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        if db_manager.is_connected:
            col = db_manager.get_collection(self.collection_name)
            cursor = col.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
            return list(cursor)
        else:
            analyses = self._read_fallback()
            return analyses[skip:skip + limit]

    def delete(self, analysis_id: str) -> bool:
        if db_manager.is_connected:
            col = db_manager.get_collection(self.collection_name)
            res = col.delete_one({"analysis_id": analysis_id})
            return res.deleted_count > 0
        else:
            analyses = self._read_fallback()
            initial_len = len(analyses)
            filtered = [a for a in analyses if a.get("analysis_id") != analysis_id]
            if len(filtered) < initial_len:
                self._write_fallback(filtered)
                return True
            return False

    def get_dashboard_metrics(self) -> Dict[str, Any]:
        analyses = self.get_all(limit=1000)
        total_analyses = len(analyses)
        if total_analyses == 0:
            return {
                "total_analyses": 0,
                "total_potholes_detected": 0,
                "high_severity_potholes": 0,
                "average_confidence": 0.0,
                "average_processing_time_ms": 0.0,
                "severity_distribution": {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0},
                "detection_trend": [],
                "has_data": False
            }

        total_potholes = sum(a.get("pothole_count", 0) for a in analyses)
        total_high_sev = 0
        conf_values = []
        time_values = []
        sev_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}

        for a in analyses:
            p_list = a.get("potholes", [])
            for p in p_list:
                s = p.get("severity", "LOW")
                if s in sev_counts:
                    sev_counts[s] += 1
                if s in ["HIGH", "CRITICAL"]:
                    total_high_sev += 1
                if "confidence" in p:
                    conf_values.append(p["confidence"])

            if "processing_time_ms" in a:
                time_values.append(a["processing_time_ms"])

        avg_conf = float(sum(conf_values) / len(conf_values)) if conf_values else 0.0
        avg_time = float(sum(time_values) / len(time_values)) if time_values else 0.0

        # Trend (last 7 analyses in chronological order)
        trend = []
        for a in reversed(analyses[:7]):
            created = a.get("created_at", "")[:10]
            trend.append({
                "date": created or a.get("analysis_id", "")[:8],
                "potholes": a.get("pothole_count", 0),
                "severity_score": round(avg_conf * 100, 1)
            })

        return {
            "total_analyses": total_analyses,
            "total_potholes_detected": total_potholes,
            "high_severity_potholes": total_high_sev,
            "average_confidence": round(avg_conf, 4),
            "average_processing_time_ms": round(avg_time, 1),
            "severity_distribution": sev_counts,
            "detection_trend": trend,
            "has_data": True
        }

analysis_repo = AnalysisRepository()
