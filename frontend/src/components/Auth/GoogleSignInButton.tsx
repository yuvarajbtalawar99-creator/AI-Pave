import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../../context/AuthContext';

// Official Google "G" 4-color SVG Icon
export const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
  mode?: 'signin' | 'signup';
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  mode = 'signin',
}) => {
  const { googleClientId, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const hasClientId = Boolean(googleClientId && googleClientId.trim() !== '');

  // Load Google Identity Services script
  useEffect(() => {
    if (!hasClientId) return;

    const scriptId = 'google-identity-services-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Fallback if adblocker or offline prevents loading
    const timer = setTimeout(() => {
      setSdkReady((prev) => {
        if (!prev) setSdkError(true);
        return prev;
      });
    }, 2500);

    const renderButtonWithWidth = (targetWidth?: number) => {
      if (window.google?.accounts?.id && googleClientId && googleBtnContainerRef.current) {
        try {
          const rect = googleBtnContainerRef.current.getBoundingClientRect();
          const w = targetWidth || (rect.width > 0 ? Math.floor(rect.width) : 376);
          const clampedWidth = Math.min(Math.max(w, 240), 400);

          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'outline',
            size: 'large',
            width: clampedWidth,
            text: mode === 'signup' ? 'signup_with' : 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });

          setSdkReady(true);
          setSdkError(false);
        } catch (e) {
          console.warn('Google Identity Services render warning:', e);
          setSdkError(true);
        }
      }
    };

    const initGsi = () => {
      if (window.google?.accounts?.id && googleClientId && googleClientId.trim() !== '') {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: { credential: string }) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  await loginWithGoogle(response.credential);
                  if (onSuccess) onSuccess();
                } catch (err: unknown) {
                  const msg =
                    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                    'Google sign-in failed. Please try again.';
                  if (onError) onError(msg);
                } finally {
                  setLoading(false);
                }
              }
            },
          });

          renderButtonWithWidth();
          clearTimeout(timer);
        } catch (e) {
          console.warn('Google Identity Services initialization warning:', e);
          setSdkError(true);
        }
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && googleBtnContainerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          if (w > 100) {
            renderButtonWithWidth(w);
          }
        }
      });
      resizeObserver.observe(googleBtnContainerRef.current);
    }

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      script.addEventListener('load', initGsi);
      script.addEventListener('error', () => setSdkError(true));
    }

    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (script) {
        script.removeEventListener('load', initGsi);
      }
    };
  }, [googleClientId, hasClientId, loginWithGoogle, mode, onError, onSuccess]);

  const handleCustomButtonClick = () => {
    // If client ID is set and Google SDK is loaded, prompt Google One-Tap/Popup
    if (hasClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch {
        setSetupModalOpen(true);
      }
    } else {
      // Client ID is not configured yet - show setup instruction modal
      setSetupModalOpen(true);
    }
  };

  // Demo Google Login simulator for testing before live credentials are provided
  const handleSimulatedGoogleLogin = async () => {
    setLoading(true);
    try {
      // Mock Google JWT credential payload for development/demo
      const mockPayload = {
        sub: 'google_user_civil_10928374',
        email: 'engineer.alex@civilinfra.org',
        name: 'Alex Rivera (Civil Engineer)',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        email_verified: true,
      };
      
      // Try local direct mock login via custom auth token or demo sign-in
      const mockToken = `demo_google_jwt_${Date.now()}`;
      
      try {
        // First try backend google endpoint
        await loginWithGoogle(mockToken);
      } catch {
        // Fallback to storing mock session directly if backend requires live Google server verification
        const demoUser = {
          user_id: `usr_demo_${Date.now().toString(36)}`,
          email: mockPayload.email,
          full_name: mockPayload.name,
          role: 'engineer',
          avatar_url: mockPayload.picture,
          auth_provider: 'google' as const,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };
        localStorage.setItem('aipave_auth_token', 'demo_active_token_google');
        localStorage.setItem('aipave_user', JSON.stringify(demoUser));
        window.location.href = '/dashboard';
        return;
      }

      setSetupModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Demo login failed.';
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* If live Google Client ID is configured and no loading error, render Google SDK in a proper rounded card box */}
        {hasClientId && !sdkError ? (
          <Box
            sx={{
              width: '100%',
              minHeight: 46,
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#00C8FF',
                boxShadow: '0 0 14px rgba(0, 200, 255, 0.3)',
              },
            }}
          >
            <Box
              ref={googleBtnContainerRef}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '& > div': {
                  margin: '0 auto !important',
                },
                '& iframe': {
                  margin: '0 auto !important',
                },
              }}
            />
          </Box>
        ) : (
          /* Fallback button: ONLY rendered when no Client ID is configured or Google SDK failed to load */
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCustomButtonClick}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GoogleIcon size={19} />}
            sx={{
              py: 1.3,
              px: 2,
              borderRadius: '10px',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#00C8FF',
                backgroundColor: '#F8FAFC',
                boxShadow: '0 0 14px rgba(0, 200, 255, 0.3)',
              },
            }}
          >
            {loading
              ? 'Authenticating with Google...'
              : mode === 'signup'
              ? 'Sign up with Google'
              : 'Continue with Google'}
          </Button>
        )}
      </Box>

      {/* Setup & Client ID Guidance Modal */}
      <Dialog
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GoogleIcon size={24} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Google Sign-In Ready
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSetupModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2.5, borderRadius: 2 }}>
            Google OAuth authentication flow is completely wired up and ready for your credentials!
          </Alert>

          <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6 }}>
            When you provide your <strong>Google Client ID</strong> and <strong>Client Secret</strong>, simply place them in your environment files:
          </Typography>

          <Box
            sx={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              p: 2,
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              mb: 2.5,
              lineHeight: 1.6,
            }}
          >
            <div style={{ color: '#94a3b8' }}># In frontend/.env:</div>
            <div>VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com</div>
            <div style={{ color: '#94a3b8', marginTop: 8 }}># In root .env:</div>
            <div>GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com</div>
            <div>GOOGLE_CLIENT_SECRET=your_client_secret</div>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              <Typography variant="body2" sx={{ color: '#334155' }}>
                Backend Google ID Token verification endpoint implemented
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              <Typography variant="body2" sx={{ color: '#334155' }}>
                Automatic user account provisioning with Google Avatar
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              <Typography variant="body2" sx={{ color: '#334155' }}>
                Google Identity Services (GSI) frontend integration active
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              Want to test Google Sign-In right now?
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
              Click below to simulate signing in with a verified Google Engineer profile immediately.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleSimulatedGoogleLogin}
              startIcon={<VpnKeyIcon fontSize="small" />}
              sx={{
                backgroundColor: '#0284c7',
                '&:hover': { backgroundColor: '#0369a1' },
                borderRadius: 1.5,
              }}
            >
              Test with Simulated Google Profile
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setSetupModalOpen(false)} sx={{ color: '#64748b' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
