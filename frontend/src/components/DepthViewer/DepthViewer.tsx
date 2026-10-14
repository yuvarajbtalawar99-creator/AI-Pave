import { Box, Typography, Paper, Alert, Chip } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { Pothole } from '../../types';

interface DepthViewerProps {
  depthImageUrl?: string;
  selectedPothole?: Pothole | null;
}

export const DepthViewer: React.FC<DepthViewerProps> = ({
  depthImageUrl,
  selectedPothole,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon sx={{ color: '#0284c7' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Monocular Depth & Depression Topography
          </Typography>
        </Box>
        <Chip
          label={
            selectedPothole
              ? selectedPothole.is_calibrated
                ? 'Calibrated Scale'
                : 'Relative Estimate'
              : 'Scene Macro Topography'
          }
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: selectedPothole
              ? selectedPothole.is_calibrated
                ? '#f0fdf4'
                : '#fffbeb'
              : '#f1f5f9',
            color: selectedPothole
              ? selectedPothole.is_calibrated
                ? '#166534'
                : '#92400e'
              : '#475569',
            border: `1px solid ${
              selectedPothole
                ? selectedPothole.is_calibrated
                  ? '#bbf7d0'
                  : '#fde68a'
                : '#e2e8f0'
            }`,
          }}
        />
      </Box>

      {/* Engineering disclaimer per Section 18 */}
      <Alert
        severity={selectedPothole ? (selectedPothole.is_calibrated ? 'success' : 'info') : 'info'}
        sx={{ mb: 2, fontSize: '0.8rem' }}
      >
        {selectedPothole
          ? selectedPothole.is_calibrated
            ? 'Physical metric depth was calculated using provided reference calibration parameters.'
            : 'Monocular RGB camera input cannot physically guarantee absolute metric depth without stereoscopic or known reference scale. The value below represents the relative depression index compared against surrounding road base.'
          : 'No pothole defect selected. Localized depression profiling requires a detected defect boundary. The topography below illustrates the global roadway perspective gradient.'}
      </Alert>

      {/* Selected Pothole Depth Profile */}
      {selectedPothole ? (
        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1.5, border: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Pothole #{selectedPothole.pothole_id} Depth Analysis
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Depth Metric:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {selectedPothole.display_depth}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Depression Index:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#0284c7' }}>
                {selectedPothole.relative_depth_index} / 1.00
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Classification Status:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                {selectedPothole.depth_status}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1.5, border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
            No pothole localized in this frame. Localized depth analysis compares pothole interior depression against surrounding road plane.
          </Typography>
        </Box>
      )}

      {/* Topographic Depth Map Image */}
      {depthImageUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', mb: 1 }}>
            {selectedPothole
              ? 'Topographic Depth Colormap (Turbo/Inferno Surface Depression Gradient):'
              : 'Road Surface Perspective Topography (Macro Scene Gradient):'}
          </Typography>
          <Box
            component="img"
            src={depthImageUrl}
            alt="Depth colormap"
            sx={{
              width: '100%',
              maxHeight: 220,
              objectFit: 'cover',
              borderRadius: 1.5,
              border: '1px solid #e2e8f0',
            }}
          />
        </Box>
      )}
    </Paper>
  );
};
