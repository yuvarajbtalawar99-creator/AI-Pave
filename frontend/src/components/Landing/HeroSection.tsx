import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StraightenIcon from '@mui/icons-material/Straighten';
import SecurityIcon from '@mui/icons-material/Security';

export const HeroSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'bbox' | 'mask' | 'depth'>('bbox');

  const scrollToOverview = () => {
    const el = document.getElementById('product');
    if (el) {
      const headerOffset = 76;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Gradient Accents */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.04) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 5, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Headline & Value Proposition */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ maxWidth: 620 }}>
              {/* Engineering Standard Chip */}
              <Chip
                icon={<SecurityIcon sx={{ fontSize: '15px !important', color: '#0284c7' }} />}
                label="RDD2022 Benchmark Validated • Zero Fabricated Metrics"
                size="small"
                sx={{
                  backgroundColor: '#f0f9ff',
                  color: '#0369a1',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mb: 2.5,
                  border: '1px solid #bae6fd',
                }}
              />

              {/* Headline */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '3rem', md: '3.4rem' },
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: { xs: 1.15, md: 1.12 },
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                }}
              >
                AI-Powered Road Inspection, <br />
                <Box
                  component="span"
                  sx={{
                    color: '#0284c7',
                    display: 'inline-block',
                  }}
                >
                  From Image to Action.
                </Box>
              </Typography>

              {/* Subheading */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: '#475569',
                  lineHeight: 1.65,
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                AI-PAVE analyzes roadway images and video to detect potholes, estimate damage
                characteristics, assess severity, and provide deterministic maintenance recommendations.
              </Typography>

              {/* CTA Action Cluster */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4,
                }}
              >
                <Button
                  component={Link}
                  to="/analyze"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    px: 3.25,
                    py: 1.4,
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(2, 132, 199, 0.16)',
                    '&:hover': {
                      backgroundColor: '#0369a1',
                      boxShadow: '0 6px 12px rgba(2, 132, 199, 0.25)',
                    },
                  }}
                >
                  Start an Inspection
                </Button>

                <Button
                  onClick={scrollToOverview}
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#334155',
                    borderColor: '#cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    px: 3,
                    py: 1.4,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#94a3b8',
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  Explore AI-PAVE
                </Button>

                <Button
                  component={Link}
                  to="/evaluation"
                  sx={{
                    color: '#0284c7',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    p: 1,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  View Evaluation →
                </Button>
              </Box>

              {/* Trust & Scientific Integrity Badges */}
              <Box
                sx={{
                  pt: 3,
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                    Software-Only (Zero Hardware)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StraightenIcon sx={{ fontSize: 16, color: '#0284c7' }} />
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                    Monocular Relative Depth
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LayersIcon sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                    Transparent Engineering Rules
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Realistic Inspection Product Visualization */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Header Bar of Inspection Window */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 1.5,
                  mb: 1.5,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#64748b',
                    }}
                  >
                    survey_road_frame_0128.jpg • 1920×1080
                  </Typography>
                </Box>

                {/* Layer toggle for realistic interaction */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, val) => val && setViewMode(val)}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      py: 0.3,
                      px: 1,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textTransform: 'none',
                    },
                  }}
                >
                  <ToggleButton value="bbox">Box</ToggleButton>
                  <ToggleButton value="mask">Mask</ToggleButton>
                  <ToggleButton value="depth">Depth</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Visual Road Canvas Mock */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 280, sm: 350 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Simulated Road Surface Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      viewMode === 'depth'
                        ? 'radial-gradient(ellipse at 52% 48%, #1e1b4b 0%, #312e81 30%, #0369a1 55%, #10b981 75%, #f59e0b 90%, #ef4444 100%)'
                        : 'linear-gradient(180deg, #334155 0%, #1e293b 60%, #0f172a 100%)',
                    opacity: 0.95,
                  }}
                />

                {/* Road Lane Marking Simulation */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 4,
                    transform: 'translateX(-50%)',
                    background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 25px, transparent 25px, transparent 50px)',
                  }}
                />

                {/* Pothole Defect Region */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '36%',
                    left: '42%',
                    width: { xs: 140, sm: 180 },
                    height: { xs: 90, sm: 115 },
                    borderRadius: '44% 56% 50% 50% / 40% 45% 55% 60%',
                    backgroundColor: viewMode === 'depth' ? '#0f172a' : '#090d16',
                    boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.85)',
                    border:
                      viewMode === 'mask'
                        ? '2.5px solid #00f2fe'
                        : '1px solid rgba(255,255,255,0.1)',
                  }}
                />

                {/* Segmentation Polygon Glow (when in mask mode) */}
                {viewMode === 'mask' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '36%',
                      left: '42%',
                      width: { xs: 140, sm: 180 },
                      height: { xs: 90, sm: 115 },
                      borderRadius: '44% 56% 50% 50% / 40% 45% 55% 60%',
                      backgroundColor: 'rgba(56, 189, 248, 0.25)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* YOLO Bounding Box with Corner Accents */}
                {(viewMode === 'bbox' || viewMode === 'mask') && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '32%',
                      left: '38%',
                      width: { xs: 168, sm: 215 },
                      height: { xs: 115, sm: 145 },
                      border: '2px solid #0284c7',
                      borderRadius: 1,
                      boxShadow: '0 0 12px rgba(2, 132, 199, 0.35)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Bounding Box Label Pill */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -24,
                        left: -2,
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        px: 1,
                        py: 0.3,
                        borderRadius: '4px 4px 0 0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      POTHOLE #01 • 92%
                    </Box>
                  </Box>
                )}

                {/* Real-time analytical measurement badge */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    p: 1.5,
                    borderRadius: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>
                    ESTIMATED AREA (SAMPLE)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                    0.24 m²* <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>(4,820 px²)</span>
                  </Typography>
                </Paper>

                {/* Severity Badge Tag */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    border: '1px solid rgba(234, 88, 12, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                  <Typography variant="caption" sx={{ color: '#fb923c', fontWeight: 700, letterSpacing: 0.5 }}>
                    SEVERITY: HIGH
                  </Typography>
                </Paper>
              </Box>

              {/* Analytical Telemetry Footer Strip */}
              <Box
                sx={{
                  mt: 2,
                  pt: 1.5,
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Surface Depression Index:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    0.68 / 1.00 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>(Relative Monocular Profile)</span>
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.7rem' }}>
                  *Metric units require camera calibration scale
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
