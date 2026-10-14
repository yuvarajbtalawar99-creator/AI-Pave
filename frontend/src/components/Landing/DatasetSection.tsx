import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export const DatasetSection: React.FC = () => {
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
          {/* Left Column: Context & Integrity */}
          <Grid size={{ xs: 12, lg: 6 }}>
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
                Data Provenance & Rigor
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
                Trained on Real-World Road Damage.
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.65, mb: 4 }}>
                AI-PAVE integrates with the international <strong>Road Damage Dataset 2022 (RDD2022)</strong>,
                a multi-national benchmark spanning diverse pavement conditions, asphalt distress types,
                and lighting environments.
              </Typography>

              {/* Technical Dataset Pillars */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7', mt: 0.25 }}>
                    <FactCheckIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Class Code D40 Standardization
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>
                      Adheres strictly to the standardized D40 classification taxonomy for pothole cavity defect identification.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7', mt: 0.25 }}>
                    <EnhancedEncryptionIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Perceptual Hash Deduplication
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>
                      Enforces perceptual dHash filtering during dataset ingestion to prevent near-duplicate video frame leakage between train, validation, and test splits.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Dataset Specification Card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#f0f9ff', color: '#0284c7' }}>
                    <MenuBookIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      RDD2022 Benchmark Specification
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Crowdsensing Road Damage Challenge
                    </Typography>
                  </Box>
                </Box>
                <Chip label="CC BY-SA 4.0" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
              </Box>

              {/* Attribute Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Primary Class:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>D40 Pothole</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Split Partitioning:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0284c7' }}>Train / Val / Test (Held-Out)</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Input Resolution:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>640 × 640 Native</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Annotation Format:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>YOLO Polygons & BBoxes</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', display: 'block' }}>
                Reproducibility logs and training metadata are recorded inside <code>artifacts/models/</code> with deterministic checkpoints.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
