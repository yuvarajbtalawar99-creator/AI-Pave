"""
AI-PAVE Maintenance Recommendation Engine
Deterministic, engineering-grounded maintenance decision support.
Generates explainable actions based on severity, geometry, depth profile, and surface condition.
"""

from typing import List, Dict, Any
from app.schemas.recommendation import MaintenanceSummary, RecommendationItem

class RecommendationService:
    def __init__(self):
        pass

    def generate_recommendations(
        self,
        potholes: List[Dict[str, Any]],
        overall_condition: str
    ) -> MaintenanceSummary:
        """
        Synthesizes deterministic engineering actions.
        Groups potholes by urgency and provides transparent rationale.
        """
        if not potholes:
            item = RecommendationItem(
                category="Routine Survey & Visual Verification",
                urgency="Scheduled Survey",
                inspection_protocol="No potholes detected by the current model. This result does not establish that the road is defect-free. Conduct periodic visual condition inspection.",
                maintenance_procedure="No immediate pothole patching indicated by automated detection.",
                preventive_measures=[
                    "Maintain roadside drainage to avoid surface water ponding.",
                    "Monitor for micro-cracking, joint separation, and raveling during regular civil patrols."
                ],
                engineering_rationale="No localized pothole depressions surpassed the confidence threshold in the analyzed frame.",
                target_pothole_ids=[]
            )
            return MaintenanceSummary(
                overall_urgency="Scheduled Survey",
                action_items=[item]
            )

        # Segregate by severity
        crit_ids = [p["pothole_id"] for p in potholes if p.get("severity") == "CRITICAL"]
        high_ids = [p["pothole_id"] for p in potholes if p.get("severity") == "HIGH"]
        med_ids = [p["pothole_id"] for p in potholes if p.get("severity") == "MEDIUM"]
        low_ids = [p["pothole_id"] for p in potholes if p.get("severity") == "LOW"]

        action_items = []

        # 1. Critical Actions
        if crit_ids:
            action_items.append(RecommendationItem(
                category="Emergency Road Repair",
                urgency="Immediate (Within 24-48 hours)",
                inspection_protocol=(
                    "Conduct mandatory on-site engineering inspection. Verify whether sub-base saturation "
                    "or structural foundation loss has occurred beneath the surface layer."
                ),
                maintenance_procedure=(
                    "Deploy temporary hot-mix or polymer-modified cold asphalt patch immediately to eliminate "
                    "vehicular hazard. Plan full-depth saw-cutting, removal of deteriorated material, and permanent hot-mix asphalt (HMA) compaction."
                ),
                preventive_measures=[
                    "Inspect roadside ditch/culvert grade to identify subsurface moisture intrusion.",
                    "Verify subgrade compaction around defect perimeter to prevent reflective shear cracking."
                ],
                engineering_rationale=(
                    f"Pothole(s) {crit_ids} demonstrate deep relative depression and extensive surface coverage, "
                    "constituting high impact risk to vehicle tires, suspensions, and traffic flow."
                ),
                target_pothole_ids=crit_ids
            ))

        # 2. High Actions
        if high_ids:
            action_items.append(RecommendationItem(
                category="Prioritized Patching",
                urgency="High Priority (Within 3-7 days)",
                inspection_protocol=(
                    "Inspect surrounding pavement edge stability and moisture content. Assess whether defect is localized "
                    "or linked to structural fatigue across the lane wheelpath."
                ),
                maintenance_procedure=(
                    "Square-cut damaged perimeter boundaries, clean loose aggregate, apply bituminous tack coat, "
                    "and compact asphalt wearing course in lifts not exceeding 50 mm."
                ),
                preventive_measures=[
                    "Route and seal connected longitudinal/transverse cracks within 1 meter radius.",
                    "Check road cross-slope crown to ensure proper runoff diversion away from wheelpaths."
                ],
                engineering_rationale=(
                    f"Pothole(s) {high_ids} show significant geometric area and advancing edge fracture that will rapidly "
                    "expand under repetitive axle loads and moisture penetration."
                ),
                target_pothole_ids=high_ids
            ))

        # 3. Medium Actions
        if med_ids:
            action_items.append(RecommendationItem(
                category="Scheduled Patching & Crack Sealing",
                urgency="Scheduled Maintenance (Within 2-4 weeks)",
                inspection_protocol="Assess ravelling rate and surface void expansion during routine municipal route survey.",
                maintenance_procedure=(
                    "Perform clean-and-fill semi-permanent patching or spray injection patching to prevent moisture ingress."
                ),
                preventive_measures=[
                    "Apply localized chip seal or elastomeric joint sealant across developing micro-cracks."
                ],
                engineering_rationale=(
                    f"Pothole(s) {med_ids} represent moderate surface distress. Prompt repair prevents escalation "
                    "to full-depth subgrade degradation."
                ),
                target_pothole_ids=med_ids
            ))

        # 4. Low Actions
        if low_ids and not crit_ids and not high_ids:
            action_items.append(RecommendationItem(
                category="Preventive Maintenance & Monitoring",
                urgency="Routine Monitoring",
                inspection_protocol="Record GPS coordinates and monitor depth/area evolution during quarterly pavement reviews.",
                maintenance_procedure="Skin patching or mastic asphalt surface application if void expands.",
                preventive_measures=[
                    "Apply surface rejuvenation emulsion to slow asphalt binder oxidation."
                ],
                engineering_rationale=(
                    f"Pothole(s) {low_ids} are minor shallow surface depressions posing minimal immediate vehicular risk."
                ),
                target_pothole_ids=low_ids
            ))

        overall_urgency = (
            "Immediate (Within 24-48 hours)" if crit_ids else
            "High Priority (Within 3-7 days)" if high_ids else
            "Scheduled Maintenance (Within 2-4 weeks)" if med_ids else
            "Routine Monitoring"
        )

        return MaintenanceSummary(
            overall_urgency=overall_urgency,
            action_items=action_items
        )

recommendation_service = RecommendationService()
