import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import SchoolIcon from '@mui/icons-material/School';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: <LocationCityIcon sx={{ color: '#0284c7' }} />,
    title: 'Municipal Road Authorities',
    description: 'Systematic road asset monitoring, defect cataloguing, and budget allocation for public highway networks.',
  },
  {
    icon: <EngineeringIcon sx={{ color: '#0284c7' }} />,
    title: 'Pavement Maintenance Contractors',
    description: 'Rapid distress quantification to estimate patch materials, work order urgency, and crew dispatch requirements.',
  },
  {
    icon: <ScienceIcon sx={{ color: '#0284c7' }} />,
    title: 'Infrastructure Researchers',
    description: 'Benchmark evaluation of road degradation, crack propagation, and asphalt distress on standardized test splits.',
  },
  {
    icon: <BusinessIcon sx={{ color: '#0284c7' }} />,
    title: 'Civil Engineering Surveyors',
    description: 'Objective visual baseline surveys prior to construction, utility trenching, or resurfacing acceptance.',
  },
  {
    icon: <AltRouteIcon sx={{ color: '#0284c7' }} />,
    title: 'Smart City Fleet Ingestion',
    description: 'Automated frame-by-frame defect logging using dashcam feeds from existing municipal maintenance vehicles.',
  },
  {
    icon: <SchoolIcon sx={{ color: '#0284c7' }} />,
    title: 'Academic & Vision Labs',
    description: 'Transparent, reproducible baseline pipeline separating pixel detection from physical calibration for academic study.',
  },
];

export const UseCasesSection: React.FC = () => {
  return (
    <Box
      id="solutions"
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
            Operational Applications
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
            Designed for Road Inspection Workflows
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Built to provide practical decision support across public agencies, contractor fleets, and engineering studies.
          </Typography>
        </Box>

        {/* 6 Use Case Cards */}
        <Grid container spacing={3}>
          {USE_CASES.map((uc) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={uc.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0284c7',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: '#f0f9ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {uc.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 1 }}>
                  {uc.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                  {uc.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
