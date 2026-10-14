import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: <CloudUploadIcon sx={{ color: '#0284c7' }} />,
    title: 'Capture or Upload',
    description: 'Ingest raw road photographs or dashcam video without dedicated hardware sensors.',
    detail: 'Supports JPG, PNG, WEBP, and MP4 dashcam surveys with automatic frame extraction.',
  },
  {
    number: '02',
    icon: <CenterFocusWeakIcon sx={{ color: '#0284c7' }} />,
    title: 'Detect Roadway Damage',
    description: 'Computer-vision model localizes potholes with bounding boxes and confidence scores.',
    detail: 'Trained YOLOv8 architecture optimized for roadway distress localization.',
  },
  {
    number: '03',
    icon: <SquareFootIcon sx={{ color: '#0284c7' }} />,
    title: 'Analyze Characteristics',
    description: 'Extract polygon segmentation masks, spatial area, and monocular relative depth.',
    detail: 'Strict separation between pixel geometry and calibrated physical measurements.',
  },
  {
    number: '04',
    icon: <WarningAmberIcon sx={{ color: '#ea580c' }} />,
    title: 'Assess Severity',
    description: 'Classify damage risk level from Low to Critical using transparent, audited rules.',
    detail: 'Evaluates cavity area, depth gradient, and road type without black-box hallucinations.',
  },
  {
    number: '05',
    icon: <BuildCircleIcon sx={{ color: '#16a34a' }} />,
    title: 'Generate Recommendations',
    description: 'Produce deterministic maintenance actions tailored for municipal work crews.',
    detail: 'Identifies cold-pour vs. hot-mix asphalt (HMA) patching and preventive sealing.',
  },
  {
    number: '06',
    icon: <PictureAsPdfIcon sx={{ color: '#0f172a' }} />,
    title: 'Store & Export Report',
    description: 'Archive inspection records into searchable database and generate executive PDFs.',
    detail: 'Audit trail for highway departments with timestamps, telemetry, and defect logs.',
  },
];

export const ProductOverview: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <Box
      id="product"
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
            End-To-End Inspection Workflow
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
            From Road Image to Inspection Insight.
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A rigorous 6-stage analytical pipeline designed to automate road distress quantification
            from standard visual media.
          </Typography>
        </Box>

        {/* 6-Step Horizontal Pipeline Grid */}
        <Grid container spacing={2.5}>
          {STEPS.map((step, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={step.number}>
                <Paper
                  elevation={0}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid',
                    borderColor: isHovered ? '#0284c7' : '#e2e8f0',
                    borderRadius: 2.5,
                    boxShadow: isHovered
                      ? '0 10px 25px -5px rgba(2, 132, 199, 0.1)'
                      : '0 1px 3px 0 rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-3px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Step Header: Number & Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        backgroundColor: '#f0f9ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: isHovered ? '#0284c7' : '#94a3b8',
                      }}
                    >
                      STEP {step.number}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      fontSize: '1.05rem',
                      mb: 1,
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#475569',
                      lineHeight: 1.55,
                      mb: 2,
                      flexGrow: 1,
                    }}
                  >
                    {step.description}
                  </Typography>

                  {/* Detail expansion on hover */}
                  <Box
                    sx={{
                      pt: 1.5,
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: isHovered ? '#0369a1' : '#64748b',
                        fontWeight: isHovered ? 600 : 400,
                        display: 'block',
                        fontSize: '0.76rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {step.detail}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
