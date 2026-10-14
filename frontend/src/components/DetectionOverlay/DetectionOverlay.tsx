import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Pothole } from '../../types';
import { analysisApi } from '../../services/analysisApi';

export type ViewMode = 'original' | 'detection' | 'segmentation' | 'depth' | 'overlay';

interface DetectionOverlayProps {
  originalUrl: string;
  detectionUrl?: string;
  segmentationUrl?: string;
  depthUrl?: string;
  overlayUrl?: string;
  potholes: Pothole[];
  selectedPotholeId?: number | null;
  onSelectPothole?: (id: number) => void;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  originalUrl,
  detectionUrl,
  segmentationUrl,
  depthUrl,
  overlayUrl,
  potholes,
  selectedPotholeId,
  onSelectPothole,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overlay');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showConfidence, setShowConfidence] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Determine active media URL based on mode
  const getActiveImageUrl = () => {
    switch (viewMode) {
      case 'original':
        return analysisApi.getMediaUrl(originalUrl);
      case 'detection':
        return analysisApi.getMediaUrl(detectionUrl || overlayUrl || originalUrl);
      case 'segmentation':
        return analysisApi.getMediaUrl(segmentationUrl || overlayUrl || originalUrl);
      case 'depth':
        return analysisApi.getMediaUrl(depthUrl || originalUrl);
      case 'overlay':
      default:
        return analysisApi.getMediaUrl(overlayUrl || detectionUrl || originalUrl);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Top Controls Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          p: 1.5,
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {/* Layer Toggles */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#cbd5e1',
              '&.Mui-selected': {
                backgroundColor: '#0284c7',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#0369a1' },
              },
            },
          }}
        >
          <ToggleButton value="original">Original</ToggleButton>
          <ToggleButton value="detection">Detection</ToggleButton>
          <ToggleButton value="segmentation">Segmentation</ToggleButton>
          <ToggleButton value="depth">Depth Topography</ToggleButton>
          <ToggleButton value="overlay">Combined Inspection</ToggleButton>
        </ToggleButtonGroup>

        {/* View Options & Zoom */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Labels</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showConfidence}
                onChange={(e) => setShowConfidence(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Confidence</Typography>}
            sx={{ m: 0 }}
          />

          <Box sx={{ width: 1, height: 20, bgcolor: '#cbd5e1', mx: 0.5 }} />

          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: '#475569' }}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: '#475569' }}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton size="small" onClick={handleResetZoom} sx={{ color: '#475569' }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ color: '#64748b', minWidth: 40, textAlign: 'right', fontWeight: 600 }}>
            {Math.round(zoomLevel * 100)}%
          </Typography>
        </Box>
      </Box>

      {/* Interactive Image Surface */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#0f172a',
          overflow: 'auto',
          minHeight: 460,
          maxHeight: 640,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            display: 'inline-block',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={getActiveImageUrl()}
            alt="Pavement analysis view"
            sx={{
              maxWidth: '100%',
              display: 'block',
              borderRadius: 1,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            }}
          />
        </Box>
      </Box>

      {/* Pothole Select Pills Footer */}
      {potholes.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            p: 1.5,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mr: 1 }}>
            Detected Potholes ({potholes.length}):
          </Typography>
          {potholes.map((p) => {
            const isSelected = selectedPotholeId === p.pothole_id;
            return (
              <Chip
                key={p.pothole_id}
                label={`#${p.pothole_id} (${(p.confidence * 100).toFixed(1)}%) - ${p.severity}`}
                size="small"
                onClick={() => onSelectPothole && onSelectPothole(p.pothole_id)}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  backgroundColor: isSelected ? '#0284c7' : 'transparent',
                  color: isSelected ? '#ffffff' : '#334155',
                  borderColor: isSelected ? '#0284c7' : '#cbd5e1',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: isSelected ? '#0369a1' : '#f1f5f9',
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    </Paper>
  );
};
