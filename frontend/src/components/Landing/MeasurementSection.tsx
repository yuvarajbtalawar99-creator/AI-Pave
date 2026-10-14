import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LayersIcon from '@mui/icons-material/Layers';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const MeasurementSection: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
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
            Physical & Geometric Metrology
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
            Go Beyond Detection.
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Most vision tools merely draw a box. AI-PAVE extracts actionable dimensional characteristics
            required for maintenance volume estimates and road priority scoring.
          </Typography>
        </Box>

        {/* 3 Core Analytical Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Card 1: Geometry */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7' }}>
                  <SquareFootIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Geometry & Metrology
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 3 }}>
                Quantifies the physical footprint of road distress to assist asphalt patch volume
                calculations and work order preparation.
              </Typography>

              {/* Data attributes list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Surface Area:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>0.24 m² / 4,820 px²</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Estimated Width:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>48.2 cm / 120 px</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Estimated Length:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>52.0 cm / 130 px</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Bounding Region:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>[x1, y1, x2, y2]</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                  *Metric units (cm/m) are reported only when calibration scale is provided. Uncalibrated inputs default to pixel basis.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Card 2: Depth */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7' }}>
                  <LayersIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Monocular Depth Profile
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 3 }}>
                Evaluates surface depression gradients by contrasting inner cavity luminance and perspective
                distortion against an annular baseline road ring.
              </Typography>

              {/* Data attributes list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Depression Index:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>0.68 / 1.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Classification:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#ea580c' }}>Significant Depression</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Depth Colormap:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#0f172a' }}>Turbo/Inferno Gradient</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.75, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Annular Baseline:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#16a34a' }}>Surrounding Perimeter</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                  *Depth from single 2D RGB imagery is mathematically relative. Physical metric depth requires stereoscopic or reference markers.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Card 3: Severity */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fff7ed', color: '#ea580c' }}>
                  <AssessmentIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Severity Classification
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 3 }}>
                Stratifies detected pavement distress into 4 prioritized tiers according to transparent,
                inspectable rules rather than stochastic guesswork.
              </Typography>

              {/* Severity Tiers list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 'auto' }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>CRITICAL SEVERITY</Typography>
                  <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 600 }}>Emergency dispatch (&lt;24h)</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#fff7ed', border: '1px solid #ffedd5', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700 }}>HIGH SEVERITY</Typography>
                  <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 600 }}>Priority patching (&lt;48h)</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#f0f9ff', border: '1px solid #e0f2fe', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700 }}>MEDIUM SEVERITY</Typography>
                  <Typography variant="caption" sx={{ color: '#075985', fontWeight: 600 }}>Scheduled maintenance</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>LOW SEVERITY</Typography>
                  <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>Routine monitoring</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                  *Rules defined deterministically in <code>configs/severity_rules.yaml</code> for complete auditability.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Prominent Scientific Disclaimer Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <InfoOutlinedIcon sx={{ color: '#0284c7', fontSize: 24, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#334155', lineHeight: 1.55 }}>
            <strong>Scientific Rigor Guarantee:</strong> Physical measurements require valid camera calibration or reference scale markers.
            Depth derived from a single 2D RGB image is treated as a relative surface depression index compared against surrounding road base.
            AI-PAVE strictly distinguishes between direct pixel counts and verified physical dimensions.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
