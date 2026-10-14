import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Hotspot {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'canvas',
    label: 'Interactive Inspection Canvas',
    icon: <CenterFocusStrongIcon fontSize="small" />,
    description: 'Direct multi-layer overlay of bounding boxes, polygon contours, and surface distress zones.',
  },
  {
    id: 'depth',
    label: 'Topographic Depth Profiler',
    icon: <LayersIcon fontSize="small" />,
    description: 'Relative cavity depression analysis comparing internal depression against undisturbed road base.',
  },
  {
    id: 'matrix',
    label: 'Deterministic Decision Matrix',
    icon: <AssignmentIcon fontSize="small" />,
    description: 'Transparent civil engineering repair recommendations formulated without black-box generative text.',
  },
];

export const ProductShowcase: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<string>('canvas');

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
        {/* Section Header */}
        <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center', mb: { xs: 5, md: 7 } }}>
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
            Product Showcase
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
            A Clean, Focused Interface for Pavement Engineers.
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed specifically for highway engineers, municipal inspectors, and road maintenance contractors.
          </Typography>
        </Box>

        {/* Browser-Window Styled Showcase */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            border: '1px solid #cbd5e1',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 12px 35px -5px rgba(15, 23, 42, 0.08)',
            backgroundColor: '#f8fafc',
            mb: 4,
          }}
        >
          {/* Mock Browser Header Bar */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              px: 2.5,
              py: 1.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
              <Box
                sx={{
                  ml: 2,
                  px: 2,
                  py: 0.4,
                  backgroundColor: '#f1f5f9',
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontFamily: 'monospace',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                https://ai-pave.local/dashboard
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="LIVE SYSTEM PREVIEW"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                }}
              />
            </Box>
          </Box>

          {/* Interior App UI Mockup */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Top Mock Header Strip */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                  Roadway Defect Triage & Telemetry
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Municipal Survey Batch #2026-09-A • Highway Sector 4
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#0284c7', fontSize: '0.75rem', px: 2 }}
              >
                Live Dashboard
              </Button>
            </Box>

            {/* Mock KPI Mini Strip */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper elevation={0} sx={{ p: 1.75, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Total Identified</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>12 Potholes</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper elevation={0} sx={{ p: 1.75, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>High / Critical</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ea580c' }}>3 Priority</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper elevation={0} sx={{ p: 1.75, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Mean Confidence</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0284c7' }}>91.4%</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper elevation={0} sx={{ p: 1.75, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Calibration Basis</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a' }}>0.4 cm / px</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Dual Panel Inspection Mock */}
            <Grid container spacing={2.5}>
              {/* Left Canvas Panel */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Visual Canvas & Polygon Contours
                    </Typography>
                    <Chip label="YOLOv8-Seg Active" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#f0f9ff', color: '#0284c7' }} />
                  </Box>
                  <Box
                    sx={{
                      height: 220,
                      backgroundColor: '#1e293b',
                      borderRadius: 1.5,
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
                    {/* Road Defect with polygon box */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: 140,
                        height: 90,
                        border: '2px solid #0284c7',
                        borderRadius: 1,
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#ffffff', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.65rem' }}>
                        POTHOLE #01 • 94%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.6rem' }}>
                        Area: 0.18 m²
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Decision Support Panel */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        Maintenance Triage
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                      Action recommended for Municipal Crew #3:
                    </Typography>
                    <Box sx={{ p: 1.25, backgroundColor: '#fff7ed', borderRadius: 1.5, border: '1px solid #ffedd5', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'block' }}>
                        Saw-Cut Clean Perimeter & Compacted HMA Patch
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9a3412', fontSize: '0.72rem' }}>
                        Priority: Immediate dispatch within 48 hours.
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component={Link}
                    to="/history"
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ fontSize: '0.75rem', borderColor: '#cbd5e1', color: '#475569' }}
                  >
                    View All 15 Records
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Hotspots Interactive Navigator */}
        <Grid container spacing={2} sx={{ maxWidth: 1100, mx: 'auto', mb: 3 }}>
          {HOTSPOTS.map((h) => {
            const isSelected = h.id === activeHotspot;
            return (
              <Grid size={{ xs: 12, md: 4 }} key={h.id}>
                <Paper
                  component="button"
                  onClick={() => setActiveHotspot(h.id)}
                  elevation={0}
                  sx={{
                    p: 2,
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                    border: '1px solid',
                    borderColor: isSelected ? '#0284c7' : '#e2e8f0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ color: isSelected ? '#0284c7' : '#64748b', mt: 0.25 }}>
                    {h.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isSelected ? '#0369a1' : '#0f172a' }}>
                      {h.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.4, display: 'block', mt: 0.25 }}>
                      {h.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Centered CTA */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              px: 4,
              py: 1.25,
              borderRadius: 2,
              '&:hover': { backgroundColor: '#0369a1' },
            }}
          >
            Open AI-PAVE Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
