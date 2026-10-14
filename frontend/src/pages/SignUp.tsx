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
  MenuItem,
  LinearProgress,
  Container,
  Chip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/Auth/GoogleSignInButton';

const ROLE_OPTIONS = [
  { value: 'inspector', label: 'Field Road Inspector' },
  { value: 'engineer', label: 'Civil / Highway Engineer' },
  { value: 'contractor', label: 'Pavement Maintenance Contractor' },
  { value: 'admin', label: 'Municipal Department Admin' },
];

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('inspector');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { score: 50, label: 'Fair', color: '#f59e0b' };
    if (score <= 75) return { score: 75, label: 'Good', color: '#0284c7' };
    return { score: 100, label: 'Strong', color: '#16a34a' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        full_name: fullName.trim(),
        email: email.trim(),
        role,
        password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Registration failed. Please try again or check connection.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      {/* Left Info Panel */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '44%',
          backgroundColor: '#090d16',
          backgroundImage:
            'radial-gradient(circle at 15% 25%, rgba(2, 132, 199, 0.2) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',
          color: '#ffffff',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #1e293b',
        }}
      >
        <Box>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <ConstructionIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#ffffff', lineHeight: 1.1 }}>
                AI-PAVE
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Next-Gen Pavement Intelligence
              </Typography>
            </Box>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: -1, lineHeight: 1.2, mb: 2 }}>
            Join Civil Engineers & Road Safety Teams
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: 500, mb: 4 }}>
            Create your account to start processing field footage, calibrating camera parameters, generating ISO-compliant pavement quality ratings, and automating repair cost estimations.
          </Typography>

          {/* Value Pillars */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, backgroundColor: 'rgba(2, 132, 199, 0.15)', borderRadius: 1.5, color: '#38bdf8' }}>
                <CheckCircleIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                  Millimetric Defect Quantification
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Extract precise surface area (m²), perimeter, and relative depth estimation per pothole.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, backgroundColor: 'rgba(2, 132, 199, 0.15)', borderRadius: 1.5, color: '#38bdf8' }}>
                <SecurityIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                  Deterministic Decision Support
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Auditable severity classification based on IRC:82 and AASHTO engineering criteria.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ p: 1, backgroundColor: 'rgba(2, 132, 199, 0.15)', borderRadius: 1.5, color: '#38bdf8' }}>
                <VerifiedUserIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                  Secure Role-Based Access
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Dedicated workflows for inspectors, project engineers, and administrative managers.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ pt: 4, borderTop: '1px solid #1e293b' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            AI-PAVE Inspection System • Powered by Ultralytics YOLOv8 & PyTorch
          </Typography>
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2.5, sm: 4, md: 5 },
        }}
      >
        <Container maxWidth="sm">
          {/* Back Link */}
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon fontSize="small" />}
            size="small"
            sx={{
              color: '#64748b',
              mb: 2.5,
              alignSelf: 'flex-start',
              '&:hover': { color: '#0f172a' },
            }}
          >
            Back to Home
          </Button>

          <Card
            elevation={0}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 3.5,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      backgroundColor: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                    }}
                  >
                    <ConstructionIcon fontSize="small" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                    Create Your Account
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Register to configure automated inspection reports and road quality analytics.
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              {/* Continue with Google */}
              <Box sx={{ mb: 2.5 }}>
                <GoogleSignInButton
                  mode="signup"
                  onSuccess={() => navigate('/dashboard')}
                  onError={(err) => setErrorMessage(err)}
                />
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 2.5, color: '#94a3b8', fontSize: '0.8rem' }}>
                or register with email
              </Divider>

              {/* Signup Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="fullName"
                    placeholder="Marcus Davis"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                {/* Email Address */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                    Work Email
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    type="email"
                    placeholder="marcus.davis@transport.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                {/* Organizational Role */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                    Primary Operational Role
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Password */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  {/* Strength Bar */}
                  {password && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Strength:</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: strength.color }}>
                          {strength.label}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={strength.score}
                        sx={{
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': { backgroundColor: strength.color },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Confirm Password */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="small"
                    error={Boolean(confirmPassword && confirmPassword !== password)}
                    helperText={
                      confirmPassword && confirmPassword !== password
                        ? 'Passwords do not match'
                        : ''
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                {/* Terms Agreement */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#0284c7' } }}
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ color: '#475569' }}>
                        I agree to the <strong>Terms of Service</strong> and road inspection data standards.
                      </Typography>
                    }
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    boxShadow: '0 1px 3px 0 rgba(2, 132, 199, 0.3)',
                    '&:hover': {
                      backgroundColor: '#0369a1',
                      boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.4)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>

              {/* Sign In Link */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    style={{
                      color: '#0284c7',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};
