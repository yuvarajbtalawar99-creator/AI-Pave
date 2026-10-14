import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export const About: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          About AI-PAVE
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          AI-Based Pothole Detection, Measurement, Severity Assessment and Road Maintenance Recommendation System.
        </Typography>
      </Box>

      {/* Core Mission */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          System Overview & Engineering Objectives
        </Typography>
        <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.6 }}>
          AI-PAVE is a production-oriented, software-only pavement inspection application engineered to automate the
          detection, geometric dimensioning, relative depth profiling, severity classification, and maintenance
          recommendation workflow for civil engineers, municipal highway authorities, and pavement maintenance contractors.
        </Typography>
        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6 }}>
          Unlike consumer apps that claim fabricated 99% accuracy or invent centimetre measurements from single uncalibrated
          2D images, AI-PAVE rigorously separates pixel measurements from calibrated physical metrics, utilizes monocular
          relative depth analysis against surrounding pavement baselines, and reports real, verified benchmark evaluation
          scores on strictly held-out test datasets.
        </Typography>
      </Paper>

      {/* Dataset & Licensing */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MenuBookIcon sx={{ color: '#0284c7' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Supported Dataset: RDD2022
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
          AI-PAVE is structured for ingestion and training against the international <strong>Road Damage Dataset 2022 (RDD2022)</strong>:
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Primary Source:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Crowdsensing Road Challenge</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Kaggle Dataset:</Typography>
              <MuiLink
                href="https://www.kaggle.com/datasets/aliabdelmenam/rdd-2022"
                target="_blank"
                rel="noreferrer"
                sx={{ display: 'block', fontWeight: 600, fontSize: '0.875rem' }}
              >
                rdd-2022 on Kaggle
              </MuiLink>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>License:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>CC BY-SA 4.0</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Class Code:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>D40 (Pothole Defect)</Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ color: '#475569' }}>
          The data ingestion engine (<code>scripts/prepare_dataset.py</code>) enforces perceptual hashing (dHash) to eliminate
          exact and near-duplicate frames from moving vehicles, preventing data leakage across train, validation, and test splits.
        </Typography>
      </Paper>

      {/* Technical Principles */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%', p: 1, border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ScienceIcon sx={{ color: '#0284c7' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Monocular Depth Estimation Architecture
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                Depth estimation from a single standard RGB image utilizes perspective gradients and local photometric
                attenuation. The pothole mask region is evaluated against a surrounding perimeter annulus to compute a
                relative depression index [0.0 - 1.0]. Calibrated metric units (cm/m) are only reported if the user supplies
                verified camera geometry or reference dimension scale factors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: '100%', p: 1, border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VerifiedUserIcon sx={{ color: '#16a34a' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Deterministic Decision Support
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                Maintenance and repair actions are generated via transparent, deterministic civil engineering rules
                (<code>configs/severity_rules.yaml</code>). The system never generates unverified maintenance procedures
                via uncontrolled generative LLMs, ensuring explainability and auditability for highway departments.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mandatory Engineering Disclaimer */}
      <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
        <strong>Structural Inspection Notice:</strong> AI-PAVE is an automated decision-support tool. All maintenance
        recommendations, severity scores, and geometric measurements must be validated by a qualified municipal pavement
        engineer before dispatching asphalt milling, sub-base excavation, or paving contractors.
      </Alert>
    </Box>
  );
};
