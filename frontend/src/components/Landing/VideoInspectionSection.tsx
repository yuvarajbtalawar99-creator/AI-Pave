import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import TimelineIcon from '@mui/icons-material/Timeline';
import FlakyIcon from '@mui/icons-material/Flaky';
import SpeedIcon from '@mui/icons-material/Speed';

export const VideoInspectionSection: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 5, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Visual Video Timeline Interface Mock */}
          <Grid size={{ xs: 12, lg: 7 }} sx={{ order: { xs: 2, lg: 1 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
              }}
            >
              {/* Video Mock Canvas */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 240, sm: 320 },
                  backgroundColor: '#0f172a',
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                {/* Asphalt road perspective */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  }}
                />

                {/* Perspective Center Line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 3,
                    transform: 'translateX(-50%)',
                    background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 20px, transparent 20px, transparent 40px)',
                  }}
                />

                {/* Tracked Defect in Motion with Track ID Tag */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '42%',
                    left: '46%',
                    width: 140,
                    height: 85,
                    border: '2px solid #38bdf8',
                    borderRadius: 1,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      px: 0.75,
                      py: 0.2,
                      borderRadius: 0.5,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      width: 'fit-content',
                    }}
                  >
                    TRACK ID #03 • 91%
                  </Box>
                  <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.62rem' }}>
                    Frame 128 • SEV: HIGH
                  </Typography>
                </Box>

                {/* Live Tracking HUD Banner */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<VideocamIcon sx={{ fontSize: '14px !important', color: '#ffffff' }} />}
                    label="RECORDING SURVEY 00:18"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                    }}
                  />
                  <Chip
                    label="30 FPS • BYTETRACK ASSOCIATED"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(2, 132, 199, 0.9)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                    }}
                  />
                </Box>
              </Box>

              {/* Video Timeline Playhead Scrub Bar */}
              <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                    00:04.26 / 00:18.00
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                    Active Defect Event: Pothole #03 (Frames 112 – 148)
                  </Typography>
                </Box>

                {/* Timeline Scrubber Mock */}
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#e2e8f0',
                    borderRadius: 4,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '32%',
                      backgroundColor: '#0284c7',
                      borderRadius: 4,
                    }}
                  />
                  {/* Pothole occurrence pins on timeline */}
                  <Box sx={{ position: 'absolute', left: '32%', top: -4, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#0284c7', border: '3px solid #ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                  <Box sx={{ position: 'absolute', left: '15%', top: 1, width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                  <Box sx={{ position: 'absolute', left: '68%', top: 1, width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Explanatory Content */}
          <Grid size={{ xs: 12, lg: 5 }} sx={{ order: { xs: 1, lg: 2 } }}>
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
                Continuous Survey Telemetry
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
                Inspect Roads Frame by Frame.
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.65, mb: 4 }}>
                AI-PAVE can analyze roadway video frame-by-frame and associate detections across frames
                to support comprehensive inspection review.
              </Typography>

              {/* Key Video Principles List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7', mt: 0.25 }}>
                    <TimelineIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Persistent Tracking IDs
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>
                      Potholes are assigned stable identifiers as vehicles approach, eliminating double-counting of the same road defect across sequential frames.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7', mt: 0.25 }}>
                    <FlakyIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Perceptual Hash Deduplication
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>
                      Idling at traffic signals or slow vehicle movement triggers dHash filtering to prevent duplicate processing.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7', mt: 0.25 }}>
                    <SpeedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Software-Only Execution
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>
                      Works with standard dashboard-mounted smartphone cameras or fleet dashcams without requiring custom vehicular sensors.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
