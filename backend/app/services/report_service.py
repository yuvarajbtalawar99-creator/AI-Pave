"""
AI-PAVE PDF Inspection Report Generation Service
Generates professional engineering inspection reports using ReportLab,
incorporating all computer vision overlays, depth topographies,
scikit-learn evaluation metrics, confusion matrices, and precision-recall graphs.
"""

import os
from pathlib import Path
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, KeepTogether, HRFlowable, PageBreak
)
from app.core.config import settings

class ReportService:
    def __init__(self):
        self.reports_dir = settings.get_reports_path()

    def generate_pdf_report(self, analysis_data: Dict[str, Any]) -> str:
        analysis_id = analysis_data["analysis_id"]
        pdf_filename = f"{analysis_id}.pdf"
        pdf_path = self.reports_dir / pdf_filename

        # Ensure evaluation metrics and scikit-learn plots are available
        if not analysis_data.get("evaluation"):
            try:
                from app.services.evaluation_plot_service import evaluation_plot_service
                analysis_data["evaluation"] = evaluation_plot_service.generate_evaluation_for_analysis(analysis_data)
            except Exception:
                pass

        doc = SimpleDocTemplate(
            str(pdf_path),
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom typography styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0f172a"),
            fontName="Helvetica-Bold"
        )
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#64748b")
        )
        section_style = ParagraphStyle(
            "SectionHeader",
            parent=styles["Heading2"],
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#0f172a"),
            fontName="Helvetica-Bold",
            spaceBefore=10,
            spaceAfter=5
        )
        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=8.5,
            leading=11.5,
            textColor=colors.HexColor("#334155")
        )
        fig_caption_style = ParagraphStyle(
            "FigCaption",
            parent=styles["Normal"],
            fontSize=7.5,
            leading=9.5,
            textColor=colors.HexColor("#475569"),
            alignment=1  # Centered
        )
        table_header_style = ParagraphStyle(
            "TableHeader",
            parent=styles["Normal"],
            fontSize=8,
            leading=10,
            textColor=colors.white,
            fontName="Helvetica-Bold"
        )
        table_cell_style = ParagraphStyle(
            "TableCell",
            parent=styles["Normal"],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#1e293b")
        )
        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontSize=7.5,
            leading=10.5,
            textColor=colors.HexColor("#64748b"),
            fontName="Helvetica-Oblique"
        )

        elements = []

        # 1. Header Title
        elements.append(Paragraph("AI-PAVE Inspection & Diagnostic Report", title_style))
        elements.append(Paragraph("AI-Based Pothole Detection, Instance Segmentation, Monocular Depth & Scikit-Learn Evaluation", subtitle_style))
        elements.append(Spacer(1, 6))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0288d1"), spaceBefore=2, spaceAfter=8))

        # Format inspection date to local time
        raw_created = analysis_data.get('created_at', '')
        formatted_date = 'N/A'
        if raw_created:
            try:
                from datetime import datetime
                dt = datetime.fromisoformat(raw_created.replace('Z', '+00:00'))
                formatted_date = dt.astimezone().strftime('%Y-%m-%d %H:%M:%S')
            except Exception:
                formatted_date = raw_created[:19].replace('T', ' ')

        # 2. Metadata Table
        meta_data = [
            [
                Paragraph(f"<b>Analysis ID:</b> {analysis_id}", body_style),
                Paragraph(f"<b>Inspection Date:</b> {formatted_date}", body_style),
            ],
            [
                Paragraph(f"<b>Media Source:</b> {analysis_data.get('file_name', 'N/A')}", body_style),
                Paragraph(f"<b>Model Version:</b> {analysis_data.get('model_version', 'N/A')}", body_style),
            ],
            [
                Paragraph(f"<b>Overall Condition:</b> {analysis_data.get('overall_condition', 'N/A')}", body_style),
                Paragraph(f"<b>Total Potholes:</b> {analysis_data.get('pothole_count', 0)}", body_style),
            ],
            [
                Paragraph(f"<b>Avg Confidence:</b> {analysis_data.get('average_confidence', 0.0)*100:.1f}%", body_style),
                Paragraph(f"<b>Processing Time:</b> {analysis_data.get('processing_time_ms', 0):.0f} ms", body_style),
            ]
        ]
        meta_table = Table(meta_data, colWidths=[270, 270])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 8))

        # 3. Multimodal Computer Vision Overlays & Maps Gallery
        comb_file = settings.get_output_path() / f"{analysis_id}_annotated.jpg"
        det_file = settings.get_output_path() / f"{analysis_id}_detection.jpg"
        seg_file = settings.get_output_path() / f"{analysis_id}_segmentation.jpg"
        depth_file = settings.get_output_path() / f"{analysis_id}_depth.jpg"

        has_vision_gallery = all(f.exists() for f in [comb_file, det_file, seg_file, depth_file])

        if has_vision_gallery:
            elements.append(Paragraph("1. Multimodal Visual Inspection & Vision Overlays", section_style))
            vision_table_data = [
                [
                    Paragraph("<b>Figure 1A:</b> Combined Inspection Overlay", fig_caption_style),
                    Paragraph("<b>Figure 1B:</b> YOLOv8 Detection Bounding Boxes", fig_caption_style),
                ],
                [
                    RLImage(str(comb_file), width=260, height=140),
                    RLImage(str(det_file), width=260, height=140),
                ],
                [
                    Paragraph("<b>Figure 1C:</b> Instance Segmentation Contours", fig_caption_style),
                    Paragraph("<b>Figure 1D:</b> Monocular Depth Topography Heatmap", fig_caption_style),
                ],
                [
                    RLImage(str(seg_file), width=260, height=140),
                    RLImage(str(depth_file), width=260, height=140),
                ],
            ]
            vision_table = Table(vision_table_data, colWidths=[270, 270])
            vision_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(vision_table)
            elements.append(Spacer(1, 8))
        else:
            annotated_path = analysis_data.get("annotated_media_path")
            if annotated_path and Path(annotated_path).exists():
                elements.append(Paragraph("1. Visual Inspection and Defect Localization", section_style))
                try:
                    img = RLImage(str(annotated_path), width=500, height=240)
                    elements.append(img)
                    elements.append(Spacer(1, 8))
                except Exception:
                    pass

        # 4. Pothole Defect Inventory Table
        potholes = analysis_data.get("potholes", [])
        if potholes:
            elements.append(Paragraph("2. Pothole Inventory & Geometric Assessment", section_style))
            header_row = [
                Paragraph("ID", table_header_style),
                Paragraph("Confidence", table_header_style),
                Paragraph("Severity", table_header_style),
                Paragraph("Width", table_header_style),
                Paragraph("Length", table_header_style),
                Paragraph("Area", table_header_style),
                Paragraph("Depth Assessment", table_header_style)
            ]
            table_rows = [header_row]

            for p in potholes:
                sev = p.get("severity", "LOW")
                row = [
                    Paragraph(f"#{p.get('pothole_id')}", table_cell_style),
                    Paragraph(f"{p.get('confidence', 0)*100:.1f}%", table_cell_style),
                    Paragraph(f"<b>{sev}</b>", table_cell_style),
                    Paragraph(str(p.get("display_width", "N/A")), table_cell_style),
                    Paragraph(str(p.get("display_length", "N/A")), table_cell_style),
                    Paragraph(str(p.get("display_area", "N/A")), table_cell_style),
                    Paragraph(str(p.get("display_depth", "N/A")), table_cell_style),
                ]
                table_rows.append(row)

            p_table = Table(table_rows, colWidths=[30, 65, 60, 95, 95, 95, 100])
            p_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]))
            elements.append(p_table)
            elements.append(Spacer(1, 8))

        # 5. Scikit-Learn Model Evaluation & Diagnostic Graphs
        eval_data = analysis_data.get("evaluation")
        if eval_data:
            elements.append(Paragraph("3. AI Model Evaluation & Scikit-Learn Diagnostic Graphs", section_style))
            m = eval_data.get("metrics", {})
            eval_table_data = [
                [
                    Paragraph(f"<b>Precision:</b> {m.get('precision', 0.0)*100:.1f}%", body_style),
                    Paragraph(f"<b>Recall:</b> {m.get('recall', 0.0)*100:.1f}%", body_style),
                    Paragraph(f"<b>F1-Score:</b> {m.get('f1_score', 0.0)*100:.1f}%", body_style),
                ],
                [
                    Paragraph(f"<b>Detection IoU:</b> {m.get('detection_iou', 0.0)*100:.1f}%", body_style),
                    Paragraph(f"<b>Dice Score:</b> {m.get('dice_score', 0.0)*100:.1f}%", body_style),
                    Paragraph(f"<b>Inference Latency:</b> {m.get('inference_time_ms', 0):.0f} ms ({m.get('fps', 0):.1f} FPS)", body_style),
                ]
            ]
            eval_table = Table(eval_table_data, colWidths=[180, 180, 180])
            eval_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]))
            elements.append(eval_table)
            elements.append(Spacer(1, 6))

            # Embed Scikit-Learn Diagnostic Plots
            cm_file = settings.get_output_path() / f"{analysis_id}_eval_cm.png"
            pr_file = settings.get_output_path() / f"{analysis_id}_eval_pr.png"
            feat_file = settings.get_output_path() / f"{analysis_id}_eval_features.png"

            # Row 1: Confusion Matrix and Precision-Recall Curve
            if cm_file.exists() and pr_file.exists():
                plots_row1_data = [
                    [
                        Paragraph("<b>Figure 2A:</b> Scikit-Learn Confusion Matrix", fig_caption_style),
                        Paragraph("<b>Figure 2B:</b> Precision-Recall Sensitivity Curve", fig_caption_style),
                    ],
                    [
                        RLImage(str(cm_file), width=260, height=175),
                        RLImage(str(pr_file), width=260, height=175),
                    ]
                ]
                plots_row1_table = Table(plots_row1_data, colWidths=[270, 270])
                plots_row1_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                    ('TOPPADDING', (0, 0), (-1, -1), 2),
                ]))
                elements.append(plots_row1_table)
                elements.append(Spacer(1, 6))

            # Row 2: Multi-Factor Feature Diagnostics Bar Chart
            if feat_file.exists():
                feat_table_data = [
                    [Paragraph("<b>Figure 2C:</b> Defect Multi-Factor Diagnostic Breakdown", fig_caption_style)],
                    [RLImage(str(feat_file), width=460, height=185)]
                ]
                feat_table = Table(feat_table_data, colWidths=[540])
                feat_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                    ('TOPPADDING', (0, 0), (-1, -1), 2),
                ]))
                elements.append(feat_table)
                elements.append(Spacer(1, 8))

            # Feature Explainability Contribution Table
            feature_breakdown = eval_data.get("feature_breakdown", [])
            if feature_breakdown:
                fb_header = [
                    Paragraph("Diagnostic Factor", table_header_style),
                    Paragraph("Contribution Score", table_header_style),
                    Paragraph("Relative Weight", table_header_style),
                ]
                fb_rows = [fb_header]
                for fb in feature_breakdown:
                    fb_rows.append([
                        Paragraph(str(fb.get("feature", "")), table_cell_style),
                        Paragraph(f"{fb.get('score', 0):.1f}%", table_cell_style),
                        Paragraph(str(fb.get("weight", "")), table_cell_style),
                    ])
                fb_table = Table(fb_rows, colWidths=[240, 150, 150])
                fb_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#334155")),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                    ('TOPPADDING', (0, 0), (-1, -1), 2),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                ]))
                elements.append(fb_table)
                elements.append(Spacer(1, 8))

        # 6. Maintenance & Preventive Engineering Recommendations
        recs = analysis_data.get("recommendations", {})
        action_items = recs.get("action_items", [])
        if action_items:
            elements.append(Paragraph("4. Maintenance & Preventive Engineering Recommendations", section_style))
            for item in action_items:
                cat = item.get("category", "Maintenance")
                urgency = item.get("urgency", "Standard")
                target_ids = item.get("target_pothole_ids", [])
                target_str = f" [Targets: Pothole(s) {target_ids}]" if target_ids else ""

                item_header = f"<b>Category:</b> {cat} | <b>Urgency:</b> {urgency}{target_str}"
                elements.append(Paragraph(item_header, body_style))
                elements.append(Paragraph(f"<b>Inspection Protocol:</b> {item.get('inspection_protocol', '')}", body_style))
                elements.append(Paragraph(f"<b>Maintenance Procedure:</b> {item.get('maintenance_procedure', '')}", body_style))
                
                prev_list = item.get("preventive_measures", [])
                if prev_list:
                    prev_text = " • " + "<br/> • ".join(prev_list)
                    elements.append(Paragraph(f"<b>Preventive Actions:</b><br/>{prev_text}", body_style))
                elements.append(Spacer(1, 4))

        # 7. Disclaimer
        elements.append(Spacer(1, 6))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=6))
        disclaimer_text = (
            "<b>Engineering Disclaimer:</b> AI-PAVE provides automated decision-support analysis using computer vision and monocular depth "
            "estimation. Physical dimensions labeled as 'Requires calibration' represent pixel measurements. "
            "Automated classifications and maintenance heuristics do not replace mandatory on-site inspection by licensed "
            "pavement engineers, structural inspectors, or municipal road authorities."
        )
        elements.append(Paragraph(disclaimer_text, disclaimer_style))

        # Build document
        doc.build(elements)
        return str(pdf_path)

report_service = ReportService()
