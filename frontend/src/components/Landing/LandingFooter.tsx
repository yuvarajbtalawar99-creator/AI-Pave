import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';

export const LandingFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#090d16',
        color: '#94a3b8',
        pt: { xs: 8, md: 10 },
        pb: 6,
        borderTop: '1px solid #1e293b',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} sx={{ mb: { xs: 6, md: 8 } }}>
          {/* Column 1: Identity */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ConstructionIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
                AI-PAVE
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, maxWidth: 340, mb: 3 }}>
              AI-Based Pothole Detection, Measurement, Severity Assessment and Road Maintenance Recommendation System.
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
              Built as a pure software inspection engine for civil engineers, municipal public works, and road surveyors.
            </Typography>
          </Grid>

          {/* Column 2: Product */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <MuiLink component={Link} to="/dashboard" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Dashboard
              </MuiLink>
              <MuiLink component={Link} to="/analyze" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Analyze Inspection
              </MuiLink>
              <MuiLink component={Link} to="/history" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Inspection History
              </MuiLink>
              <MuiLink component={Link} to="/models" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Model Registry
              </MuiLink>
              <MuiLink component={Link} to="/evaluation" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Benchmark Evaluation
              </MuiLink>
            </Box>
          </Grid>

          {/* Column 3: Resources */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <MuiLink href="#how-it-works" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                How It Works
              </MuiLink>
              <MuiLink href="#capabilities" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Capabilities
              </MuiLink>
              <MuiLink href="#technology" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                Technology Pipeline
              </MuiLink>
              <MuiLink component={Link} to="/about" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                About AI-PAVE
              </MuiLink>
              <MuiLink component={Link} to="/settings" sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}>
                System Configuration
              </MuiLink>
            </Box>
          </Grid>

          {/* Column 4: Research & Dataset */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Research & Provenance
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <MuiLink
                href="https://www.kaggle.com/datasets/aliabdelmenam/rdd-2022"
                target="_blank"
                rel="noreferrer"
                sx={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#38bdf8' } }}
              >
                Road Damage Dataset 2022 (RDD2022) ↗
              </MuiLink>
              <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.4 }}>
                Class Code: D40 (Pothole Cavities)
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.4 }}>
                Evaluation Split: Strictly Held-Out Test Set
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.4 }}>
                License: CC BY-SA 4.0
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Disclaimer & Copyright Strip */}
        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            © 2026 AI-PAVE • Pavement Inspection & Severity Assessment System. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: '#475569', maxWidth: 600, textAlign: { xs: 'left', sm: 'right' } }}>
            <strong>Notice:</strong> AI-PAVE is an automated decision-support system. Maintenance actions and measurements
            must be verified by qualified civil engineers before field execution.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
