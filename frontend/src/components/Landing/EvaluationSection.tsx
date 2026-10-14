import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedIcon from '@mui/icons-material/Verified';
import { modelApi } from '../../services/modelApi';
import { EvaluationData } from '../../types';

export const EvaluationSection: React.FC = () => {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    modelApi
      .getEvaluationData()
      .then((res) => {
        if (!ignore) {
          setData(res);
          setHasLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setHasLoaded(true);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const metrics = data?.evaluation_metrics?.metrics;
  const hasRealMetrics =
    metrics &&
    (metrics.precision > 0 ||
      metrics.recall > 0 ||
      metrics.f1_score > 0 ||
      metrics.mAP50 > 0 ||
      metrics.detection_iou > 0);

  return (
    <Box
      id="evaluation"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#0284c7',
              letterSpacing: 1,
              display: 'block',
              mb: 1.5,
            }}
          >
            Empirical Benchmark Validation
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.75rem' },
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              mb: 2,
            }}
          >
            Measure the Model. Don't Just Trust It.
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Unlike generic platforms that claim fabricated 99% accuracy, AI-PAVE only reports
            verified metrics computed against strictly held-out test splits.
          </Typography>
        </Box>

        {/* Real Benchmark Provenance Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 2.5,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <VerifiedIcon sx={{ color: '#0284c7' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Evaluated Benchmark Split: {data?.evaluation_metrics?.dataset || 'Held-Out Test Set (RDD2022)'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Model: {data?.evaluation_metrics?.model_version || 'YOLOv8-Pothole'} • Test Images: {data?.evaluation_metrics?.test_images_count || 'Verified Split'}
                </Typography>
              </Box>
            </Box>

            <Chip
              label="NON-FABRICATED METRICS"
              size="small"
              sx={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                fontWeight: 700,
                fontSize: '0.68rem',
                border: '1px solid #bbf7d0',
              }}
            />
          </Box>
        </Paper>

        {/* Metrics Grid */}
        {hasRealMetrics ? (
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  PRECISION
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {((metrics?.precision ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  True Positives / Predicted
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  RECALL
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {((metrics?.recall ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  True Positives / Ground Truth
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  F1-SCORE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {((metrics?.f1_score ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Harmonic mean
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  mAP@50
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284c7', mb: 0.5 }}>
                  {((metrics?.mAP50 ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Mean Average Precision
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  DETECTION IOU
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {((metrics?.detection_iou ?? 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Intersection over Union
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: 2.5,
              textAlign: 'center',
              mb: 4,
            }}
          >
            <AssessmentIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Evaluation metrics will appear after a verified test-set evaluation.
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto', mt: 0.5 }}>
              AI-PAVE strictly suppresses placeholder statistics to preserve scientific research integrity.
            </Typography>
          </Paper>
        )}

        {/* CTA to Full Evaluation Page */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            to="/evaluation"
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              color: '#0284c7',
              borderColor: '#bae6fd',
              fontWeight: 600,
              px: 3.5,
              py: 1.25,
              borderRadius: 2,
              '&:hover': {
                borderColor: '#0284c7',
                backgroundColor: '#f0f9ff',
              },
            }}
          >
            View Complete Benchmark & Curves
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
