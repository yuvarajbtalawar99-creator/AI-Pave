import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import ApiIcon from '@mui/icons-material/Api';
import MemoryIcon from '@mui/icons-material/Memory';
import LayersIcon from '@mui/icons-material/Layers';
import GavelIcon from '@mui/icons-material/Gavel';
import StorageIcon from '@mui/icons-material/Storage';

interface TechLayer {
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const LAYERS: TechLayer[] = [
  {
    title: 'Client Application',
    category: 'React 19 & Material UI v9',
    icon: <WebIcon sx={{ color: '#0284c7' }} />,
    description: 'Responsive, accessible dashboard with hardware-accelerated canvas overlays and real-time video playback.',
  },
  {
    title: 'High-Performance API',
    category: 'Python 3.14 & FastAPI',
    icon: <ApiIcon sx={{ color: '#0284c7' }} />,
    description: 'Asynchronous REST gateway orchestrating frame batching, task streaming, and report generation.',
  },
  {
    title: 'Computer Vision Core',
    category: 'PyTorch & YOLOv8-Seg',
    icon: <MemoryIcon sx={{ color: '#0284c7' }} />,
    description: 'Dual-head neural network providing simultaneous bounding box regression and polygon contour segmentation.',
  },
  {
    title: 'Spatial & Depth Engine',
    category: 'Monocular Annular Gradients',
    icon: <LayersIcon sx={{ color: '#0284c7' }} />,
    description: 'Extracts relative surface depression index by evaluating cavity intensity attenuation against surrounding pavement baseline.',
  },
  {
    title: 'Deterministic Logic',
    category: 'Civil Engineering Heuristics',
    icon: <GavelIcon sx={{ color: '#ea580c' }} />,
    description: 'YAML-configured rule tables that convert geometric metrics into transparent, auditable repair recommendations.',
  },
  {
    title: 'Persistence & Reports',
    category: 'MongoDB & ReportLab PDF',
    icon: <StorageIcon sx={{ color: '#16a34a' }} />,
    description: 'Native JSON document repository with local fallback and instant vector PDF inspection reports.',
  },
];

export const TechnologySection: React.FC = () => {
  return (
    <Box
      id="technology"
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
            System Architecture
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
            Built as a Complete Inspection Pipeline
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A modular, layered software architecture designed for reliability, reproducibility,
            and auditable decision support.
          </Typography>
        </Box>

        {/* 6 Layer Grid */}
        <Grid container spacing={3}>
          {LAYERS.map((layer, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={layer.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0284c7',
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {layer.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.72rem' }}>
                      LAYER 0{idx + 1} • {layer.category}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      {layer.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.55 }}>
                  {layer.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
