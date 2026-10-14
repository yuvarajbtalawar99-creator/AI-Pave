import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CircularProgress,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

import { MetricsCard } from '../components/MetricsCard/MetricsCard';
import { modelApi } from '../services/modelApi';
import { EvaluationData } from '../types';

export const Evaluation: React.FC = () => {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    modelApi
      .getEvaluationData()
      .then((res) => {
        if (!ignore) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load evaluation data', err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={36} sx={{ color: '#0284c7' }} />
      </Box>
    );
  }

  const evalMetrics = data?.evaluation_metrics || {};
  const metrics = evalMetrics.metrics || {
    precision: 0.0,
    recall: 0.0,
    f1_score: 0.0,
    mAP50: 0.0,
    mAP50_95: 0.0,
    detection_iou: 0.0,
    mask_iou: 0.0,
    dice_score: 0.0,
    inference_time_ms: 0.0,
    fps: 0.0,
  };
  const counts = evalMetrics.counts || {
    true_positives: 0,
    false_positives: 0,
    false_negatives: 0,
    total_ground_truth: 0,
    total_predictions: 0,
  };
  const errors = data?.error_analysis || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Test Dataset Benchmark & Real Evaluation
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Honest, non-fabricated evaluation metrics computed exclusively against the held-out test split.
        </Typography>
      </Box>

      {/* Benchmark Provenance Banner */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Evaluated Benchmark:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {evalMetrics.dataset || 'Held-Out Test Dataset'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Test Images Count:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0284c7' }}>
              {evalMetrics.test_images_count || 0} images
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Evaluated Model:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {evalMetrics.model_version || 'YOLOv8-RDD2022-Pothole'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Evaluation Timestamp:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>
              {evalMetrics.evaluation_timestamp || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Real Core Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Precision"
            value={((metrics.precision ?? 0) * 100).toFixed(1) + '%'}
            subtitle={`TP: ${counts.true_positives ?? 0} / Pred: ${counts.total_predictions ?? 0}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Recall"
            value={((metrics.recall ?? 0) * 100).toFixed(1) + '%'}
            subtitle={`TP: ${counts.true_positives ?? 0} / GT: ${counts.total_ground_truth ?? 0}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="F1 Score"
            value={((metrics.f1_score ?? 0) * 100).toFixed(1) + '%'}
            subtitle="Harmonic mean"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="mAP@50"
            value={((metrics.mAP50 ?? 0) * 100).toFixed(1) + '%'}
            subtitle="Mean Average Precision"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Inference Speed"
            value={`${metrics.fps ?? 0} FPS`}
            subtitle={`${metrics.inference_time_ms ?? 0} ms / frame`}
          />
        </Grid>
      </Grid>

      {/* Detailed Metrics & Geometric IoU/Dice */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
              Segmentation & Geometric Alignment Scores
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Detection IoU:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0284c7' }}>
                  {((metrics.detection_iou ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Intersection over Union</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Dice Coefficient:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0284c7' }}>
                  {((metrics.dice_score ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Sørensen–Dice Score</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Mask IoU:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0284c7' }}>
                  {((metrics.mask_iou ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Polygon boundary overlap</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>mAP@50:95:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0284c7' }}>
                  {((metrics.mAP50_95 ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>COCO Primary Metric</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Confusion Matrix & Curves */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
              Confusion Matrix & Precision-Recall Curve
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', mb: 0.5 }}>
                  Confusion Matrix:
                </Typography>
                <Box
                  component="img"
                  src={modelApi.getChartUrl('confusion_matrix.png')}
                  alt="Confusion Matrix"
                  sx={{ width: '100%', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', mb: 0.5 }}>
                  PR Curve:
                </Typography>
                <Box
                  component="img"
                  src={modelApi.getChartUrl('pr_curve.png')}
                  alt="PR Curve"
                  sx={{ width: '100%', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Error Analysis Section */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BugReportIcon sx={{ color: '#ea580c' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Systematic Error Analysis & Model Boundary Conditions
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Identifies real edge cases where vision models encounter false positives, false negatives, or illumination drops.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ bgcolor: '#f8fafc', p: 1.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>
                False Positives: {errors.false_positives?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                Manhole covers, dark asphalt patches, or oil stains mistaken for depressions.
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ bgcolor: '#f8fafc', p: 1.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700 }}>
                False Negatives: {errors.false_negatives?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                Shallow ravelling or water-filled potholes lacking distinct dark contrast rims.
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ bgcolor: '#f8fafc', p: 1.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700 }}>
                Scale Extremes: {errors.small_potholes?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                Distant potholes (&lt;4% frame area) where feature maps lose spatial resolution.
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ bgcolor: '#f8fafc', p: 1.5, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>
                Low Confidence: {errors.low_confidence_detections?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                Detections near threshold (&lt;45% conf) requiring human inspector verification.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
