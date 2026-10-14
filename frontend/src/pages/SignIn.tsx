import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Container,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/Auth/GoogleSignInButton';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // If already authenticated, redirect to destination or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Unable to sign in. Please verify your credentials or check connection.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: 'inspector' | 'engineer' | 'admin') => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const demoUsers = {
        inspector: {
          user_id: 'usr_demo_inspector',
          email: 'inspector.davis@transport.gov',
          full_name: 'Marcus Davis (Lead Inspector)',
          role: 'inspector',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          auth_provider: 'local' as const,
          created_at: new Date().toISOString(),
        },
        engineer: {
          user_id: 'usr_demo_engineer',
          email: 'sarah.lin@civilengineering.org',
          full_name: 'Dr. Sarah Lin (Pavement Engineer)',
          role: 'engineer',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          auth_provider: 'local' as const,
          created_at: new Date().toISOString(),
        },
        admin: {
          user_id: 'usr_demo_admin',
          email: 'admin@aipave.internal',
          full_name: 'Alexandria Reed (System Admin)',
          role: 'admin',
          avatar_url: null,
          auth_provider: 'local' as const,
          created_at: new Date().toISOString(),
        },
      };

      const selected = demoUsers[demoRole];
      localStorage.setItem('aipave_auth_token', `demo_token_${demoRole}_${Date.now()}`);
      localStorage.setItem('aipave_user', JSON.stringify(selected));
      window.location.href = '/dashboard';
    } catch {
      setErrorMessage('Could not load demo profile.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#06111F',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(0, 200, 255, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 80%, rgba(2, 132, 199, 0.08) 0%, transparent 45%),
          linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================
          LEFT PANEL — AI-PAVE Brand & Computer Vision Showcase
         ======================================================== */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '52%',
          p: { lg: 5, xl: 6 },
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          borderRight: '1px solid rgba(14, 165, 233, 0.14)',
          backgroundColor: '#071322',
          backgroundImage: `
            radial-gradient(circle at 25% 30%, rgba(0, 200, 255, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 75% 70%, rgba(2, 132, 199, 0.1) 0%, transparent 55%)
          `,
          overflow: 'hidden',
        }}
      >
        {/* Subtle Decorative Ambient Beam in Corner */}
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* --- A. Brand Header --- */}
        <Box sx={{ zIndex: 2 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              textDecoration: 'none',
              mb: 3.5,
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-1px)' },
            }}
          >
            {/* Custom Engineering Road/Pavement Logo */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.25) 0%, rgba(2, 132, 199, 0.45) 100%)',
                border: '1px solid rgba(0, 200, 255, 0.5)',
                boxShadow: '0 0 24px rgba(0, 200, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C8FF',
              }}
            >
              <ConstructionIcon sx={{ fontSize: 24 }} />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    fontSize: '1.25rem',
                  }}
                >
                  AI-PAVE
                </Typography>
                <Chip
                  label="v1.0 ENTERPRISE"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(0, 200, 255, 0.12)',
                    color: '#00C8FF',
                    border: '1px solid rgba(0, 200, 255, 0.35)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  fontWeight: 500,
                }}
              >
                Civil Engineering Intelligence Platform
              </Typography>
            </Box>
          </Box>

          {/* --- B. Hero Section --- */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              mb: 1.5,
              fontSize: { lg: '1.85rem', xl: '2.25rem' },
            }}
          >
            See the Damage. Understand the Road.{' '}
            <Box
              component="span"
              sx={{
                color: '#00C8FF',
                textShadow: '0 0 25px rgba(0, 200, 255, 0.4)',
              }}
            >
              Act with Confidence.
            </Box>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: 540,
              mb: 3.5,
              fontSize: '0.925rem',
            }}
          >
            AI-powered pavement inspection that transforms road imagery into measurable defects,
            actionable engineering insights, and smarter maintenance decisions.
          </Typography>

          {/* --- C & D. Featured AI Inspection Visualization & Floating Glass Cards --- */}
          <Box sx={{ position: 'relative', maxWidth: 540, my: 1 }}>
            {/* Floating Metric Card 1: Top-Right Overlap */}
            <Box
              sx={{
                position: 'absolute',
                top: -14,
                right: 18,
                zIndex: 4,
                backgroundColor: 'rgba(6, 17, 31, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 200, 255, 0.35)',
                borderRadius: '10px',
                py: 0.75,
                px: 1.5,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 200, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
              }}
            >
              <SensorsIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
              <Box>
                <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
                  AI Detection
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 800 }}>
                  96.8% Confidence
                </Typography>
              </Box>
            </Box>

            {/* Main Visualizer Container */}
            <Box
              sx={{
                backgroundColor: 'rgba(9, 24, 39, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 200, 255, 0.22)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 200, 255, 0.08)',
              }}
            >
              {/* Inspection Feed Top Bar */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2.5,
                  py: 1.2,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(6, 17, 31, 0.95)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      boxShadow: '0 0 10px #EF4444',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: '#E2E8F0',
                      textTransform: 'uppercase',
                    }}
                  >
                    CV Inspection Stream
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      color: '#00C8FF',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    #P-841
                  </Typography>
                </Box>

                <Chip
                  label="CRITICAL"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#F87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                  }}
                />
              </Box>

              {/* Realistic Road Texture Viewport with Computer Vision Bounding Box */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 220,
                  overflow: 'hidden',
                  backgroundColor: '#0a1017',
                }}
              >
                {/* Real Asphalt Pothole Sample Image */}
                <Box
                  component="img"
                  src="/road_inspection_sample.jpg"
                  alt="Road Inspection Sample"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.08) brightness(0.92)',
                    display: 'block',
                  }}
                />

                {/* Subtle Computer Vision Scanning Beam */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00C8FF, #38BDF8, transparent)',
                    boxShadow: '0 0 12px 2px rgba(0, 200, 255, 0.7)',
                    animation: 'cvScan 3.5s ease-in-out infinite',
                    '@keyframes cvScan': {
                      '0%': { top: '5%', opacity: 0 },
                      '15%': { opacity: 0.9 },
                      '85%': { opacity: 0.9 },
                      '100%': { top: '95%', opacity: 0 },
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      animation: 'none',
                      display: 'none',
                    },
                    pointerEvents: 'none',
                  }}
                />

                {/* Cyan AI Detection Bounding Box with Technical Corner Brackets */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '26%',
                    width: '48%',
                    height: '60%',
                    border: '1.5px dashed rgba(0, 200, 255, 0.75)',
                    backgroundColor: 'rgba(0, 200, 255, 0.08)',
                    boxShadow: '0 0 15px rgba(0, 200, 255, 0.25)',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Top-Left Bracket */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      width: 12,
                      height: 12,
                      borderTop: '3px solid #00C8FF',
                      borderLeft: '3px solid #00C8FF',
                    }}
                  />
                  {/* Top-Right Bracket */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderTop: '3px solid #00C8FF',
                      borderRight: '3px solid #00C8FF',
                    }}
                  />
                  {/* Bottom-Left Bracket */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      left: -2,
                      width: 12,
                      height: 12,
                      borderBottom: '3px solid #00C8FF',
                      borderLeft: '3px solid #00C8FF',
                    }}
                  />
                  {/* Bottom-Right Bracket */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderBottom: '3px solid #00C8FF',
                      borderRight: '3px solid #00C8FF',
                    }}
                  />

                  {/* HUD Detection Pill */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: 6,
                      backgroundColor: '#00C8FF',
                      color: '#06111F',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      px: 0.9,
                      py: 0.2,
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      boxShadow: '0 2px 6px rgba(0, 200, 255, 0.4)',
                    }}
                  >
                    <span>POTHOLE DETECTED</span>
                    <span style={{ opacity: 0.8 }}>•</span>
                    <span>96.8%</span>
                  </Box>

                  {/* Coordinate Tag */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 6,
                      fontFamily: 'monospace',
                      fontSize: '0.6rem',
                      color: '#00C8FF',
                      fontWeight: 700,
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    Δd: 48.2mm
                  </Typography>
                </Box>
              </Box>

              {/* Defect Metrics Display Grid */}
              <Box sx={{ p: 2, backgroundColor: 'rgba(6, 17, 31, 0.92)' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.2,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(9, 24, 39, 0.8)',
                      p: 1.2,
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 200, 255, 0.18)',
                    }}
                  >
                    <Typography sx={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 600 }}>
                      Defect Depth
                    </Typography>
                    <Typography sx={{ color: '#00C8FF', fontSize: '1rem', fontWeight: 800 }}>
                      48.2 mm
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(9, 24, 39, 0.8)',
                      p: 1.2,
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Typography sx={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 600 }}>
                      Defect Area
                    </Typography>
                    <Typography sx={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800 }}>
                      0.38 m²
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(9, 24, 39, 0.8)',
                      p: 1.2,
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Typography sx={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 600 }}>
                      Severity Class
                    </Typography>
                    <Typography sx={{ color: '#F87171', fontSize: '1rem', fontWeight: 800 }}>
                      Critical
                    </Typography>
                  </Box>
                </Box>

                {/* Maintenance Recommendation Note */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pt: 1,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.74rem' }}>
                    Recommendation:{' '}
                    <strong style={{ color: '#E2E8F0' }}>
                      Full-Depth Asphalt Infill & Seal Coat (IRC:82-2015)
                    </strong>
                  </Typography>
                  <Typography
                    sx={{
                      color: '#475569',
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    SAMPLE INSPECTION
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Floating Metric Card 2: Bottom-Left Overlap */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -16,
                left: 18,
                zIndex: 4,
                backgroundColor: 'rgba(6, 17, 31, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '10px',
                py: 0.75,
                px: 1.5,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
              }}
            >
              <WarningAmberRoundedIcon sx={{ color: '#F87171', fontSize: 18 }} />
              <Box>
                <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
                  Maintenance Status
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#F87171', fontWeight: 800 }}>
                  Action Required
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* --- E. Trust and Capabilities Section --- */}
        <Box sx={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PrecisionManufacturingIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.84rem' }}>
              Trained on RDD2022 & benchmark pavement datasets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoGraphIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.84rem' }}>
              Image and video-based automated defect detection
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DescriptionOutlinedIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.84rem' }}>
              Engineering inspection reports & maintenance insights
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          RIGHT PANEL — Premium Authentication Card
         ======================================================== */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2.5, sm: 4, md: 5 },
          backgroundColor: '#06111F',
          position: 'relative',
        }}
      >
        <Container maxWidth="xs" sx={{ maxWidth: '440px !important' }}>
          {/* Back to Home Button */}
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon fontSize="small" />}
            size="small"
            sx={{
              color: '#94A3B8',
              mb: 2.5,
              textTransform: 'none',
              fontSize: '0.825rem',
              fontWeight: 600,
              alignSelf: 'flex-start',
              px: 0.5,
              transition: 'color 0.2s ease',
              '&:hover': { color: '#00C8FF', backgroundColor: 'transparent' },
            }}
          >
            Back to Home
          </Button>

          {/* Premium Glassmorphic Authentication Card */}
          <Card
            elevation={0}
            sx={{
              backgroundColor: 'rgba(9, 24, 39, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 200, 255, 0.18)',
              borderRadius: '22px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 200, 255, 0.05)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {/* --- A. Authentication Heading --- */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.2) 0%, rgba(2, 132, 199, 0.35) 100%)',
                      border: '1px solid rgba(0, 200, 255, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00C8FF',
                    }}
                  >
                    <ConstructionIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.025em',
                      fontSize: '1.45rem',
                    }}
                  >
                    Welcome back
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  Sign in to continue to your AI-PAVE workspace.
                </Typography>
              </Box>

              {errorMessage && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2.5,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#FCA5A5',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontSize: '0.825rem',
                  }}
                >
                  {errorMessage}
                </Alert>
              )}

              {/* --- B. Google Sign-In Button --- */}
              <Box sx={{ mb: 2.5 }}>
                <GoogleSignInButton
                  mode="signin"
                  onSuccess={() => navigate('/dashboard')}
                  onError={(err) => setErrorMessage(err)}
                />
              </Box>

              {/* Divider */}
              <Divider
                sx={{
                  my: 2.5,
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                or sign in with email
              </Divider>

              {/* --- C. Email and Password Fields Form --- */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    component="label"
                    htmlFor="email"
                    sx={{
                      fontWeight: 600,
                      color: '#CBD5E1',
                      mb: 0.6,
                      display: 'block',
                      fontSize: '0.78rem',
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'rgba(6, 17, 31, 0.75)',
                        color: '#F8FAFC',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease',
                        '& fieldset': { border: 'none' },
                        '&:hover': {
                          border: '1px solid rgba(0, 200, 255, 0.4)',
                          backgroundColor: 'rgba(6, 17, 31, 0.9)',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #00C8FF',
                          boxShadow: '0 0 0 3px rgba(0, 200, 255, 0.18)',
                        },
                      },
                      '& input::placeholder': {
                        color: '#64748B',
                        opacity: 1,
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    component="label"
                    htmlFor="password"
                    sx={{
                      fontWeight: 600,
                      color: '#CBD5E1',
                      mb: 0.6,
                      display: 'block',
                      fontSize: '0.78rem',
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: '#00C8FF', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                              sx={{ color: '#94A3B8', '&:hover': { color: '#00C8FF' } }}
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'rgba(6, 17, 31, 0.75)',
                        color: '#F8FAFC',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease',
                        '& fieldset': { border: 'none' },
                        '&:hover': {
                          border: '1px solid rgba(0, 200, 255, 0.4)',
                          backgroundColor: 'rgba(6, 17, 31, 0.9)',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #00C8FF',
                          boxShadow: '0 0 0 3px rgba(0, 200, 255, 0.18)',
                        },
                      },
                      '& input::placeholder': {
                        color: '#64748B',
                        opacity: 1,
                      },
                    }}
                  />
                </Box>

                {/* --- D. Remember Me & Forgot Password in ONE Row --- */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2.5,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#64748B',
                          p: 0.5,
                          '&.Mui-checked': { color: '#00C8FF' },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500 }}>
                        Remember this device
                      </Typography>
                    }
                  />

                  <Typography
                    variant="caption"
                    onClick={() => setForgotModalOpen(true)}
                    sx={{
                      color: '#00C8FF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#38BDF8',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>

                {/* --- E. Primary Sign-In Button --- */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.3,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00C8FF 0%, #0284C7 100%)',
                    color: '#06111F',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                    boxShadow: '0 4px 18px rgba(0, 200, 255, 0.35)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #38BDF8 0%, #0369A1 100%)',
                      boxShadow: '0 6px 24px rgba(0, 200, 255, 0.5)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(2, 132, 199, 0.35)',
                      color: 'rgba(255, 255, 255, 0.4)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: '#06111F' }} />
                  ) : (
                    'Sign In to AI-PAVE'
                  )}
                </Button>
              </Box>

              {/* --- F. Account Registration Link --- */}
              <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  New to AI-PAVE?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#00C8FF',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Box>

              {/* --- G. Demo Access (Compact Role Selector) --- */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2.2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    display: 'block',
                    mb: 1.2,
                    textAlign: 'center',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                  }}
                >
                  Explore the platform
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                  }}
                >
                  {/* Road Inspector Option */}
                  <Box
                    onClick={() => handleQuickDemo('inspector')}
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(6, 17, 31, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#00C8FF',
                        backgroundColor: 'rgba(0, 200, 255, 0.08)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 200, 255, 0.15)',
                      },
                    }}
                  >
                    <SearchIcon sx={{ color: '#00C8FF', fontSize: 18, mb: 0.2 }} />
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#E2E8F0',
                        display: 'block',
                        lineHeight: 1.2,
                      }}
                    >
                      Inspector
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#64748B' }}>
                      Field Audits
                    </Typography>
                  </Box>

                  {/* Civil Engineer Option */}
                  <Box
                    onClick={() => handleQuickDemo('engineer')}
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 200, 255, 0.05)',
                      border: '1px solid rgba(0, 200, 255, 0.3)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#00C8FF',
                        backgroundColor: 'rgba(0, 200, 255, 0.12)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 200, 255, 0.2)',
                      },
                    }}
                  >
                    <EngineeringIcon sx={{ color: '#00C8FF', fontSize: 18, mb: 0.2 }} />
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#00C8FF',
                        display: 'block',
                        lineHeight: 1.2,
                      }}
                    >
                      Engineer
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>
                      Analytics
                    </Typography>
                  </Box>

                  {/* Administrator Option */}
                  <Box
                    onClick={() => handleQuickDemo('admin')}
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(6, 17, 31, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#00C8FF',
                        backgroundColor: 'rgba(0, 200, 255, 0.08)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 200, 255, 0.15)',
                      },
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ color: '#00C8FF', fontSize: 18, mb: 0.2 }} />
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#E2E8F0',
                        display: 'block',
                        lineHeight: 1.2,
                      }}
                    >
                      Admin
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#64748B' }}>
                      Governance
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* ========================================================
          PASSWORD RECOVERY DIALOG (Dark Enterprise Themed)
         ======================================================== */}
      <Dialog
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1.5,
              backgroundColor: '#091827',
              border: '1px solid rgba(0, 200, 255, 0.25)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 200, 255, 0.1)',
              color: '#FFFFFF',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#FFFFFF', pb: 1, fontSize: '1.2rem' }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          {forgotSent ? (
            <Alert
              icon={<CheckCircleRoundedIcon fontSize="inherit" />}
              severity="success"
              sx={{
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#6EE7B7',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              If an account with <strong>{forgotEmail}</strong> exists, password recovery
              instructions have been sent.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, fontSize: '0.85rem' }}>
                Enter your registered organization email and we will send password recovery instructions.
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="you@organization.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: 'rgba(6, 17, 31, 0.8)',
                    color: '#F8FAFC',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    '& fieldset': { border: 'none' },
                    '&:hover': { border: '1px solid rgba(0, 200, 255, 0.4)' },
                    '&.Mui-focused': {
                      border: '1px solid #00C8FF',
                      boxShadow: '0 0 0 3px rgba(0, 200, 255, 0.18)',
                    },
                  },
                  '& input::placeholder': { color: '#64748B' },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setForgotModalOpen(false)}
            sx={{
              color: '#94A3B8',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { color: '#FFFFFF' },
            }}
          >
            Close
          </Button>
          {!forgotSent && (
            <Button
              variant="contained"
              onClick={() => setForgotSent(true)}
              disabled={!forgotEmail.includes('@')}
              sx={{
                background: 'linear-gradient(135deg, #00C8FF 0%, #0284C7 100%)',
                color: '#06111F',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #38BDF8 0%, #0369A1 100%)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(2, 132, 199, 0.3)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Send Link
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
