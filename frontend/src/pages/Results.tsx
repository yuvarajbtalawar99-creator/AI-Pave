import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StraightenIcon from '@mui/icons-material/Straighten';

import { DetectionOverlay } from '../components/DetectionOverlay/DetectionOverlay';
import { ResultTable } from '../components/ResultTable/ResultTable';
import { RecommendationPanel } from '../components/RecommendationPanel/RecommendationPanel';
import { DepthViewer } from '../components/DepthViewer/DepthViewer';
import { VideoPlayer } from '../components/VideoPlayer/VideoPlayer';
import { EvaluationSection } from '../components/EvaluationSection/EvaluationSection';
import { analysisApi } from '../services/analysisApi';
import { AnalysisResponse } from '../types';
import { formatLocalDateTime } from '../utils/dateUtils';

export const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [selectedPotholeId, setSelectedPotholeId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    analysisApi
      .getAnalysis(id)
      .then((data) => {
        if (!ignore) {
          setAnalysis(data);
          if (data.potholes && data.potholes.length > 0) {
            setSelectedPotholeId(data.potholes[0].pothole_id);
          }
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!ignore) {
          setError(err.response?.data?.detail || 'Failed to retrieve inspection result.');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={36} sx={{ color: '#0284c7' }} />
      </Box>
    );
  }

  if (error || !analysis) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Analysis record not found.'}
        </Alert>
        <Button component={Link} to="/history" startIcon={<ArrowBackIcon />}>
          Back to History
        </Button>
      </Box>
    );
  }

  const selectedPothole = analysis.potholes.find((p) => p.pothole_id === selectedPotholeId) || null;

  return (
    <Box>
      {/* Top Header Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Button component={Link} to="/history" size="small" startIcon={<ArrowBackIcon />} sx={{ color: '#64748b' }}>
              History
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Inspection Report: {analysis.file_name}
            </Typography>
            <Chip
              label={analysis.file_type.toUpperCase()}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.65rem', backgroundColor: '#f1f5f9' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Analysis ID: <span style={{ fontFamily: 'monospace' }}>{analysis.analysis_id}</span>
            {analysis.created_at ? ` • ${formatLocalDateTime(analysis.created_at)}` : ''} • Processed in{' '}
            {analysis.processing_time_ms} ms using {analysis.model_version}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            href={analysisApi.getPdfReportUrl(analysis.analysis_id)}
            target="_blank"
            download
            sx={{ backgroundColor: '#0f172a', color: '#ffffff' }}
          >
            Export PDF Report
          </Button>
        </Box>
      </Box>

      {/* Summary KPI Strip */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 6, sm: 3, md: 2.4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Overall Pavement Condition:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {analysis.overall_condition}
              </Typography>
              <Chip
                label={analysis.road_condition_source}
                size="small"
                sx={{ fontSize: '0.65rem', height: 18, backgroundColor: '#f1f5f9', color: '#64748b' }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2.4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Potholes Identified:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: analysis.pothole_count > 0 ? '#ea580c' : '#16a34a' }}>
              {analysis.pothole_count} {analysis.pothole_count === 1 ? 'Defect' : 'Defects'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2.4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Average Confidence:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: analysis.pothole_count > 0 ? '#0284c7' : '#64748b' }}>
              {analysis.pothole_count > 0 ? `${(analysis.average_confidence * 100).toFixed(1)}%` : 'N/A (0 defects)'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2.4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Calibration Status:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <StraightenIcon fontSize="small" sx={{ color: analysis.calibration?.is_calibrated ? '#16a34a' : '#94a3b8' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: analysis.calibration?.is_calibrated ? '#16a34a' : '#64748b' }}>
                {analysis.calibration?.is_calibrated ? 'Calibrated Scale' : 'Uncalibrated (Pixel basis)'}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2.4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Maintenance Urgency:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: analysis.pothole_count > 0 ? '#b91c1c' : '#0284c7' }}>
              {analysis.recommendations.overall_urgency}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Honest Zero-Defect Disclosure Banner */}
      {analysis.pothole_count === 0 && (
        <Alert severity="info" sx={{ mb: 3, border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', color: '#0369a1' }}>
          <strong>Automated Inspection Notice:</strong> No potholes detected by the current model at the selected confidence threshold. This result confirms no actionable defect was isolated, but does not establish that the road is defect-free. Periodic visual survey and drainage monitoring remain recommended.
        </Alert>
      )}

      {/* Main Visualizer Surface */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {analysis.file_type === 'video' ? (
            <VideoPlayer
              videoUrl={analysis.annotated_media_url || analysis.original_media_url}
              frameCount={analysis.frame_count}
              fps={analysis.fps}
              duration={analysis.duration_seconds}
              trackedCount={analysis.pothole_count}
            />
          ) : (
            <DetectionOverlay
              originalUrl={analysis.original_media_url}
              detectionUrl={analysis.detection_media_url}
              segmentationUrl={analysis.segmentation_media_url}
              depthUrl={analysis.depth_media_url}
              overlayUrl={analysis.annotated_media_url}
              potholes={analysis.potholes}
              selectedPotholeId={selectedPotholeId}
              onSelectPothole={(pid) => setSelectedPotholeId(pid)}
            />
          )}
        </Grid>

        {/* Side Panel: Depth Analysis & Topography */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <DepthViewer
            depthImageUrl={analysis.depth_media_url ? analysisApi.getMediaUrl(analysis.depth_media_url) : undefined}
            selectedPothole={selectedPothole}
          />
        </Grid>
      </Grid>

      {/* Detailed Pothole Inventory Table */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
          Pothole Defect Inventory ({analysis.potholes.length} instances)
        </Typography>
        <ResultTable
          potholes={analysis.potholes}
          selectedId={selectedPotholeId}
          onSelect={(pid) => setSelectedPotholeId(pid)}
        />
      </Box>

      {/* ML Model Evaluation & Diagnostic Visualizer */}
      {analysis.evaluation && (
        <Box sx={{ mb: 3 }}>
          <EvaluationSection
            evaluation={analysis.evaluation}
            potholeCount={analysis.pothole_count}
          />
        </Box>
      )}

      {/* Engineering Recommendation Panel */}
      <Box sx={{ mb: 4 }}>
        <RecommendationPanel
          summary={analysis.recommendations}
          overallCondition={analysis.overall_condition}
        />
      </Box>
    </Box>
  );
};
