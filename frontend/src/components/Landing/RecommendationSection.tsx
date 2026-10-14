import React from 'react';
import { Box, Container, Typography, Paper, Grid, Chip, Alert } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const RecommendationSection: React.FC = () => {
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
          {/* Left Column: Heading & Explanation */}
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
                Actionable Decision Support
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
                Turn Detection Into an Inspection Decision.
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.65, mb: 4 }}>
                Computer vision is only useful when it translates directly into maintenance action.
                AI-PAVE links detected visual distress to standard civil engineering repair specifications.
              </Typography>

              {/* Engineering Capabilities Checklist */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    <strong>Deterministic Heuristics:</strong> Repair methods are mapped via rule tables in <code>configs/severity_rules.yaml</code>.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    <strong>Immediate vs. Preventive Treatment:</strong> Distinguishes between emergency cold-patch stabilization and permanent hot-mix saw-cut restoration.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    <strong>Audit-Ready Documentation:</strong> Generates executive PDF reports complete with condition ratings and photographic evidence.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Realistic Maintenance Recommendation Card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
              }}
            >
              {/* Header Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0', color: '#0284c7' }}>
                    <BuildCircleIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      Work Order Recommendation
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Sector 4 • Chainage 12+450 (Pothole Defect #01)
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label="HIGH URGENCY"
                  size="small"
                  sx={{
                    backgroundColor: '#fff7ed',
                    color: '#c2410c',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    border: '1px solid #fed7aa',
                  }}
                />
              </Box>

              {/* Recommendation Content Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Paper elevation={0} sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    DETECTED ROAD CONDITION
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    Active Pothole Cavity with Ravelling Surface Edges
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                    Estimated surface depression indicates potential sub-base water infiltration.
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    RECOMMENDED PRIMARY ACTION
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Saw-Cut Clean Rectangular Perimeter, Apply Emulsion Tack Coat & Compacted Hot-Mix Asphalt (HMA)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                    Estimated repair footprint: ~0.35 m² including 150mm overlap cut into solid asphalt.
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    PREVENTIVE RECOMMENDATION
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    Seal longitudinal fatigue micro-cracks within 2 meters of perimeter to prevent recurrent failure during rain events.
                  </Typography>
                </Paper>
              </Box>

              {/* Mandatory Civil Engineering Disclaimer */}
              <Alert
                severity="info"
                icon={<WarningAmberIcon fontSize="small" sx={{ color: '#0284c7' }} />}
                sx={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0369a1',
                  fontSize: '0.75rem',
                  py: 0.5,
                }}
              >
                <strong>Civil Engineering Notice:</strong> AI-PAVE provides decision-support guidance. All recommendations, severity tiers, and patch dimensions must be reviewed by a certified municipal pavement engineer prior to dispatching contractors.
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
