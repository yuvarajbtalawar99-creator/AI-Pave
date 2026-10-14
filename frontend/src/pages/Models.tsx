import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LayersIcon from '@mui/icons-material/Layers';
import { modelApi } from '../services/modelApi';
import { ModelRegistryData } from '../types';

export const Models: React.FC = () => {
  const [registry, setRegistry] = useState<ModelRegistryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    modelApi
      .getModels()
      .then((data) => {
        if (!ignore) {
          setRegistry(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load model registry', err);
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

  const active = registry?.active_models || {};
  const detector = active.detector || {};
  const segmenter = active.segmenter || {};
  const depth = active.depth || {};
  const latestTrain = registry?.latest_training_metadata || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Neural Model Registry
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Configured computer-vision backends, weights checkpoints, and inference parameters.
        </Typography>
      </Box>

      {/* Active Pipeline Architectures */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
        Active Pipeline Architectures
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Detector */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label="Active Detector" size="small" icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />} sx={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                  {detector.version || 'v1'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                {detector.name || 'YOLOv8 Pothole Detector'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {detector.description || 'Neural detector for bounding box localization.'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Family:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{detector.family || 'yolo'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Input Size:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>640 × 640 px</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Weights File:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#0284c7' }}>{detector.path || 'pothole_detector_yolo.pt'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Segmenter */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label="Active Segmenter" size="small" icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />} sx={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                  {segmenter.version || 'v1'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                {segmenter.name || 'YOLOv8 Pothole Segmenter'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {segmenter.description || 'Instance polygon mask generator for pixel area and boundary contours.'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Family:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{segmenter.family || 'yolo-seg'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Input Size:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>640 × 640 px</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Weights File:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#0284c7' }}>{segmenter.path || 'pothole_segmenter_yolo.pt'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Depth Model */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label="Active Depth Model" size="small" icon={<LayersIcon sx={{ fontSize: '14px !important' }} />} sx={{ backgroundColor: '#f0f9ff', color: '#0369a1', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                  {depth.version || 'v2-small'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                {depth.name || 'Monocular Depth Estimator'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {depth.description || 'Surface depression profile analysis comparing interior vs surrounding road.'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Type:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Relative Monocular Gradient</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Depth Metric:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Relative Index [0.0 - 1.0]</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Calibration Basis:</Typography>
                  <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 600 }}>Optional User Scale</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Checkpointed Training Metadata (Reproducibility) */}
      {latestTrain && Object.keys(latestTrain).length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
            Training Reproducibility Log & Checkpoint Provenance
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Captured automatically during model training execution.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Trained Model:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{latestTrain.model_name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Timestamp:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{latestTrain.training_timestamp?.slice(0, 19).replace('T', ' ')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Duration:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{latestTrain.training_duration_seconds}s</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Device:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{latestTrain.device_used}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Model Catalog Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Registered Model Checkpoints
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Model ID</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Architecture</TableCell>
                <TableCell>mAP@50</TableCell>
                <TableCell>Latency</TableCell>
                <TableCell>Checkpoint Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registry?.available_models.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{m.id}</TableCell>
                  <TableCell>
                    <Chip label={m.type.toUpperCase()} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{m.name}</TableCell>
                  <TableCell sx={{ color: '#0284c7', fontWeight: 600 }}>
                    {m.mAP50 ? `${(m.mAP50 * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>{m.speed_ms ? `${m.speed_ms} ms` : 'N/A'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.75rem' }}>
                    {m.weights_path}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
