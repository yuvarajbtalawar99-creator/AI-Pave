"""
AI-PAVE Recommendation Schema Definitions
"""

from typing import List, Optional
from pydantic import BaseModel

class RecommendationItem(BaseModel):
    category: str # "Immediate Action", "Scheduled Maintenance", "Preventive Action"
    urgency: str # "Immediate (Within 24-48 hours)", "High Priority (3-7 days)", etc.
    inspection_protocol: str
    maintenance_procedure: str
    preventive_measures: List[str]
    engineering_rationale: str
    target_pothole_ids: List[int]

class MaintenanceSummary(BaseModel):
    overall_urgency: str
    action_items: List[RecommendationItem]
    disclaimer: str = (
        "AI-PAVE automated recommendations are deterministic decision-support heuristics "
        "and do not supersede mandatory in-person evaluation by a licensed pavement engineer "
        "or authorized municipal highway inspector."
    )
