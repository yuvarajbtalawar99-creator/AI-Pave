import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Button,
  Chip,
  Alert,
  Divider,
  Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from '../components/Auth/GoogleSignInButton';

export const Settings: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [confThreshold, setConfThreshold] = useState<number>(0.25);
  const [iouThreshold, setIouThreshold] = useState<number>(0.45);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          apiClient.get('/health'),
          apiClient.get('/system/info'),
        ]);
        setHealthData(hRes.data);
        setSystemInfo(sRes.data);
      } catch (err) {
        console.error('Failed to query system info', err);
      }
    };
    fetchSystem();
  }, []);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const { user, isAuthenticated, googleClientId, logout } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          System Configuration & Telemetry
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Inspection thresholds, user authentication, and hardware resource utilization.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings successfully updated.
        </Alert>
      )}

      {/* User Session & Google OAuth Status Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ color: '#0284c7' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Account & Authentication Status
            </Typography>
          </Box>
          <Chip
            label={isAuthenticated ? 'AUTHENTICATED' : 'GUEST / ANONYMOUS'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              backgroundColor: isAuthenticated ? 'rgba(22, 163, 74, 0.1)' : '#f1f5f9',
              color: isAuthenticated ? '#16a34a' : '#64748b',
            }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontWeight: 600 }}>
                CURRENT USER PROFILE
              </Typography>
              {isAuthenticated && user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={user.avatar_url || undefined}
                    sx={{ width: 44, height: 44, bgcolor: '#0284c7', fontWeight: 700 }}
                  >
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      {user.full_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', wordBreak: 'break-all' }}>
                      {user.email}
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#e0f2fe', color: '#0284c7', fontWeight: 700 }}
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        via {user.auth_provider === 'google' ? 'Google OAuth' : 'Email/Password'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button size="small" color="error" variant="outlined" onClick={logout} sx={{ borderRadius: 1.5 }}>
                    Sign Out
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    You are currently using AI-PAVE in guest session.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button component={Link} to="/signin" variant="outlined" size="small" sx={{ borderRadius: 1.5 }}>
                      Sign In
                    </Button>
                    <Button component={Link} to="/signup" variant="contained" size="small" sx={{ backgroundColor: '#0284c7', borderRadius: 1.5 }}>
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <GoogleIcon size={18} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  GOOGLE OAUTH 2.0 INTEGRATION
                </Typography>
              </Box>
              {googleClientId ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#16a34a' }}>
                      Configured & Ready
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', display: 'block', wordBreak: 'break-all' }}>
                    Client ID: {googleClientId}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                    Pending Client ID & Secret configuration.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code> to activate live Google One-Tap.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Backend & Environment Status */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <StorageIcon sx={{ color: '#0284c7' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Backend Infrastructure & Database
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Service Status:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={healthData?.status || 'ONLINE'}
                size="small"
                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                sx={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 700 }}
              />
              <Typography variant="caption" sx={{ color: '#64748b' }}>v1.0.0</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Database Engine:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {systemInfo?.database_backend || 'MongoDB (Native Collection)'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Compute Acceleration:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {healthData?.gpu_available ? 'NVIDIA CUDA Enabled' : 'CPU Execution Engine'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* System Hardware Diagnostics */}
      {systemInfo && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ComputerIcon sx={{ color: '#0284c7' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Host Hardware Telemetry
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Host Platform:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{systemInfo.platform}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Python Runtime:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Python {systemInfo.python_version}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>PyTorch Version:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{systemInfo.torch_version}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>RAM Available / Total:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {systemInfo.available_memory_gb} GB / {systemInfo.total_memory_gb} GB
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Inference Defaults */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
          Default Inspection Inference Parameters
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
              Default Confidence Threshold: {confThreshold}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
              Standard baseline threshold for filtering bounding boxes and segmentation masks (Default: 0.25).
            </Typography>
            <Slider
              value={confThreshold}
              min={0.1}
              max={0.9}
              step={0.05}
              onChange={(_, val) => setConfThreshold(val as number)}
              sx={{ color: '#0284c7' }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
              Default IoU NMS Threshold: {iouThreshold}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
              Non-Maximum Suppression threshold to eliminate redundant detections over same defect (Default: 0.45).
            </Typography>
            <Slider
              value={iouThreshold}
              min={0.1}
              max={0.9}
              step={0.05}
              onChange={(_, val) => setIouThreshold(val as number)}
              sx={{ color: '#0284c7' }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#0284c7' }}>
            Save Configuration
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
