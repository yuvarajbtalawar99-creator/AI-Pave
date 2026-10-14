import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { AnalysisEvaluation } from '../../types';

interface EvaluationSectionProps {
  evaluation: AnalysisEvaluation;
  potholeCount: number;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  evaluation,
  potholeCount,
}) => {
  const { metrics, feature_breakdown, charts } = evaluation;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#eff6ff',
              color: '#0284c7',
            }}
          >
            <InsightsIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              AI Model Evaluation & Diagnostic Visualizer
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Image-level machine learning validation, confusion matrix, precision-recall curve (scikit-learn), and geometric alignment metrics for this inspection.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<CheckCircleIcon sx={{ '&&': { color: '#0284c7', fontSize: 16 } }} />}
            label="Scikit-Learn Verified"
            size="small"
            sx={{ backgroundColor: '#f0f9ff', color: '#0369a1', fontWeight: 600, fontSize: '0.75rem' }}
          />
          <Chip
            icon={<AssessmentIcon sx={{ '&&': { color: '#16a34a', fontSize: 16 } }} />}
            label={potholeCount > 0 ? `${potholeCount} Defect Evaluated` : 'Intact Pavement Verified'}
            size="small"
            sx={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Box>
      </Box>

      {/* Primary KPI Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Precision */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Precision
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
              {(metrics.precision * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#0284c7', fontSize: '0.7rem' }}>
              Detection fidelity
            </Typography>
          </Paper>
        </Grid>

        {/* Recall */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Recall
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
              {(metrics.recall * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#16a34a', fontSize: '0.7rem' }}>
              Defect sensitivity
            </Typography>
          </Paper>
        </Grid>

        {/* F1 Score */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              F1 Score
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
              {(metrics.f1_score * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#ea580c', fontSize: '0.7rem' }}>
              Harmonic mean
            </Typography>
          </Paper>
        </Grid>

        {/* Detection IoU */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Detection IoU
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
              {(metrics.detection_iou * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Geometric boundary fit
            </Typography>
          </Paper>
        </Grid>

        {/* Dice Score */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Dice Score
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
              {(metrics.dice_score * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Contour similarity
            </Typography>
          </Paper>
        </Grid>

        {/* Inference Speed */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SpeedIcon sx={{ fontSize: 14, color: '#0284c7' }} /> Speed
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284c7', my: 0.5 }}>
              {metrics.fps.toFixed(1)} FPS
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              {metrics.inference_time_ms.toFixed(0)} ms latency
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Scikit-Learn Visual Graphs & Diagnostic Plots */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
        Scikit-Learn Evaluation Plots & Multi-Factor Explainability
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Plot 1: Scikit-Learn Confusion Matrix */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              backgroundColor: '#fafafa',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 1 }}>
              1. Scikit-Learn Confusion Matrix
            </Typography>
            <Box
              component="img"
              src={charts.confusion_matrix_url}
              alt="Confusion Matrix"
              sx={{
                width: '100%',
                maxHeight: 260,
                objectFit: 'contain',
                borderRadius: 1.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, fontSize: '0.72rem' }}>
              Quantifies true positive detections vs intact road negative controls using <code>sklearn.metrics.confusion_matrix</code>.
            </Typography>
          </Paper>
        </Grid>

        {/* Plot 2: Scikit-Learn Precision-Recall Curve */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              backgroundColor: '#fafafa',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 1 }}>
              2. Scikit-Learn Precision-Recall Curve
            </Typography>
            <Box
              component="img"
              src={charts.pr_curve_url}
              alt="Precision-Recall Curve"
              sx={{
                width: '100%',
                maxHeight: 260,
                objectFit: 'contain',
                borderRadius: 1.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, fontSize: '0.72rem' }}>
              Sensitivity curve across multi-threshold operating points generated via <code>sklearn.metrics.precision_recall_curve</code>.
            </Typography>
          </Paper>
        </Grid>

        {/* Plot 3: Feature Explainability Diagnostic Plot */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              backgroundColor: '#fafafa',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 1 }}>
              3. Feature Explainability Breakdown
            </Typography>
            <Box
              component="img"
              src={charts.feature_plot_url || charts.pr_curve_url}
              alt="Feature Explainability"
              sx={{
                width: '100%',
                maxHeight: 260,
                objectFit: 'contain',
                borderRadius: 1.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, fontSize: '0.72rem' }}>
              Quantifies relative diagnostic contribution of depth index, coverage area, rim irregularity, and edge ravelling.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Explainability Contribution Bars */}
      {feature_breakdown && feature_breakdown.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1.5 }}>
            Mathematical Contribution to Severity & Road Condition Decision:
          </Typography>
          <Grid container spacing={2}>
            {feature_breakdown.map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={idx}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                    {item.feature}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700 }}>
                    {item.score}% ({item.weight})
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, item.score)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: idx === 0 ? '#0284c7' : idx === 1 ? '#0ea5e9' : idx === 2 ? '#38bdf8' : '#ea580c',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Paper>
  );
};
