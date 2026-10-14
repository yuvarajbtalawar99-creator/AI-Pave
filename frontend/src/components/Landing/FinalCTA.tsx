import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ConstructionIcon from '@mui/icons-material/Construction';

export const FinalCTA: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            backgroundColor: '#0f172a',
            borderRadius: 4,
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Accent Glow */}
          <Box
            sx={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 500,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              mb: 3,
            }}
          >
            <ConstructionIcon />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              mb: 2,
            }}
          >
            Ready to Inspect a Road?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              fontSize: { xs: '1rem', md: '1.15rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4.5,
            }}
          >
            Upload a road image or video to explore detection, polygon segmentation, relative depth profiling, and maintenance recommendations.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
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
                fontWeight: 600,
                fontSize: '0.95rem',
                px: 3.5,
                py: 1.35,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                '&:hover': {
                  backgroundColor: '#0369a1',
                },
              }}
            >
              Start an Inspection
            </Button>

            <Button
              component={Link}
              to="/dashboard"
              variant="outlined"
              size="large"
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                fontSize: '0.95rem',
                px: 3.5,
                py: 1.35,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Open Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
