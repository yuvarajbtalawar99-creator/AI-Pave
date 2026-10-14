import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import VideocamIcon from '@mui/icons-material/Videocam';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LayersIcon from '@mui/icons-material/Layers';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface Capability {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const CAPABILITIES: Capability[] = [
  {
    num: '01',
    icon: <SearchIcon sx={{ color: '#0284c7' }} />,
    title: 'Pothole Detection',
    desc: 'Identify roadway potholes from uploaded images using high-precision neural bounding box regression.',
  },
  {
    num: '02',
    icon: <ImageSearchIcon sx={{ color: '#0284c7' }} />,
    title: 'Image Analysis',
    desc: 'Analyze individual road images with interactive visual annotations, polygon boundaries, and confidence badges.',
  },
  {
    num: '03',
    icon: <VideocamIcon sx={{ color: '#0284c7' }} />,
    title: 'Video Inspection',
    desc: 'Process continuous road video frame-by-frame, deduplicate moving frames, and associate detected potholes temporally.',
  },
  {
    num: '04',
    icon: <WarningAmberIcon sx={{ color: '#ea580c' }} />,
    title: 'Severity Assessment',
    desc: 'Classify detected damage into 4 discrete tiers (Low, Medium, High, Critical) using transparent, inspectable rules.',
  },
  {
    num: '05',
    icon: <LayersIcon sx={{ color: '#0284c7' }} />,
    title: 'Depth & Geometry',
    desc: 'Extract surface depression index and geometric dimensions, preserving strict separation between pixel and physical units.',
  },
  {
    num: '06',
    icon: <BuildIcon sx={{ color: '#16a34a' }} />,
    title: 'Maintenance Recommendations',
    desc: 'Generate deterministic inspection-oriented recommendations and repair specs for municipal highway departments.',
  },
  {
    num: '07',
    icon: <HistoryIcon sx={{ color: '#0f172a' }} />,
    title: 'Inspection History',
    desc: 'Review, filter, and audit past inspection surveys with thumbnail previews and immediate executive PDF report export.',
  },
  {
    num: '08',
    icon: <AssessmentIcon sx={{ color: '#0284c7' }} />,
    title: 'Benchmark Evaluation',
    desc: 'Inspect real, verifiable model performance metrics (Precision, Recall, mAP50, IoU) on held-out test datasets.',
  },
];

export const CapabilitiesSection: React.FC = () => {
  return (
    <Box
      id="capabilities"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
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
            Core Capabilities
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
            Built for the Complete Inspection Workflow
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every capability in AI-PAVE is engineered to address practical road maintenance requirements
            without unnecessary complexity.
          </Typography>
        </Box>

        {/* 8-Card Grid */}
        <Grid container spacing={3}>
          {CAPABILITIES.map((cap) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cap.num}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2.5,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0284c7',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 20px -5px rgba(2, 132, 199, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: '#f0f9ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cap.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                    }}
                  >
                    {cap.num}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 1 }}>
                  {cap.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.55 }}>
                  {cap.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
