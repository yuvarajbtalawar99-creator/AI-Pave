import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TuneIcon from '@mui/icons-material/Tune';
import StraightenIcon from '@mui/icons-material/Straighten';

export const ImageAnalysisSection: React.FC = () => {
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
        <Grid container spacing={{ xs: 5, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Upload Feature Explanation & Mock Interface */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box>
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
                Single-Frame Inspection
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.6rem' },
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  mb: 2,
                }}
              >
                Upload. Analyze. Understand.
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.65, mb: 4 }}>
                Transform handheld highway photographs and high-resolution drone snapshots into
                structured civil engineering records with transparent defect dimensions.
              </Typography>

              {/* Mock Upload Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: '#ffffff',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 2.5,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: '#0284c7', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Upload Road Image
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                  Drag & Drop or browse from your workstation
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Chip label="JPG" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  <Chip label="PNG" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  <Chip label="WEBP" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                </Box>
              </Paper>

              {/* Adjustable Parameters Notice */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TuneIcon fontSize="small" sx={{ color: '#0284c7' }} />
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                    Adjustable Confidence & IoU NMS Thresholds
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StraightenIcon fontSize="small" sx={{ color: '#16a34a' }} />
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                    Optional Known Scale (cm/px) for Physical Metrology
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                to="/analyze"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.25,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#0369a1' },
                }}
              >
                Try an Analysis
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Before vs After Dual Inspection View */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
                Dual Inspection Comparison (Before & After Analysis)
              </Typography>

              <Grid container spacing={2}>
                {/* Before: Raw Input Image */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Box
                      sx={{
                        height: 240,
                        backgroundColor: '#1e293b',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                        }}
                      />
                      {/* Raw pothole cavity */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 110,
                          height: 70,
                          borderRadius: '45% 55% 50% 50%',
                          backgroundColor: '#0a0e17',
                          boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.9)',
                        }}
                      />
                      <Chip
                        label="RAW INPUT"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 22,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, textAlign: 'center' }}>
                      Standard unannotated RGB road photograph
                    </Typography>
                  </Box>
                </Grid>

                {/* After: Fully Annotated Output */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Box
                      sx={{
                        height: 240,
                        backgroundColor: '#1e293b',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                        }}
                      />
                      {/* Pothole with bounding box and mask */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 130,
                          height: 85,
                          border: '2px solid #0284c7',
                          borderRadius: 1,
                          backgroundColor: 'rgba(56, 189, 248, 0.2)',
                          boxShadow: '0 0 15px rgba(2, 132, 199, 0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 0.75,
                        }}
                      >
                        <Box sx={{ backgroundColor: '#0284c7', color: '#ffffff', px: 0.75, py: 0.2, borderRadius: 0.5, width: 'fit-content' }}>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace' }}>
                            D40 • 93%
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.6rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                          Sev: HIGH
                        </Typography>
                      </Box>
                      <Chip
                        label="AI-PAVE ANNOTATED"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 22,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1, textAlign: 'center' }}>
                      Contours, bounding boxes, severity & area extracted
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Bottom Feature Highlights */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                  Detected Classes: <strong>D40 (Pothole Cavity)</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                  Inference Latency: <strong>~45ms / frame (CPU/GPU)</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                  Export Format: <strong>JSON API & PDF Report</strong>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
