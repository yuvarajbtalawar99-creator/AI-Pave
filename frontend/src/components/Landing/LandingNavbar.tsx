import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  targetId: string;
  isRoute?: boolean;
  routePath?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Product', targetId: 'product' },
  { label: 'How It Works', targetId: 'how-it-works' },
  { label: 'Capabilities', targetId: 'capabilities' },
  { label: 'Technology', targetId: 'technology' },
  { label: 'Evaluation', targetId: 'evaluation' },
  { label: 'Solutions', targetId: 'solutions' },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setMobileOpen(false);
    if (item.isRoute && item.routePath) {
      navigate(item.routePath);
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${item.targetId}`);
      return;
    }

    const element = document.getElementById(item.targetId);
    if (element) {
      const headerOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid rgba(226, 232, 240, 0.6)',
        transition: 'all 0.25s ease-in-out',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
          {/* Logo & Identity */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.04)' },
              }}
            >
              <ConstructionIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                }}
              >
                AI-PAVE
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  display: { xs: 'none', sm: 'block' },
                  lineHeight: 1,
                  fontSize: '0.72rem',
                  fontWeight: 500,
                }}
              >
                Pavement Inspection & Severity Assessment
              </Typography>
            </Box>
          </Box>

          {/* Desktop Center Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item)}
                sx={{
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  px: 1.75,
                  py: 0.8,
                  borderRadius: 1.5,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: '#0284c7',
                    backgroundColor: 'rgba(2, 132, 199, 0.05)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Desktop Right Action CTAs */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated && user ? (
              <>
                <Box
                  component={Link}
                  to="/settings"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    backgroundColor: 'rgba(2, 132, 199, 0.06)',
                    border: '1px solid rgba(2, 132, 199, 0.15)',
                    '&:hover': { backgroundColor: 'rgba(2, 132, 199, 0.1)' },
                  }}
                >
                  <Avatar
                    src={user.avatar_url || undefined}
                    sx={{ width: 28, height: 28, bgcolor: '#0284c7', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {user.full_name}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    px: 2.25,
                    py: 0.85,
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#0369a1' },
                  }}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/signin"
                  startIcon={<LoginIcon fontSize="small" />}
                  sx={{
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 1.5,
                    '&:hover': { color: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.05)' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#0284c7',
                    borderColor: '#38bdf8',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#0284c7',
                      backgroundColor: 'rgba(2, 132, 199, 0.05)',
                    },
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    px: 2.25,
                    py: 0.85,
                    borderRadius: 2,
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: '#0369a1',
                      boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)',
                    },
                  }}
                >
                  Launch App
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Hamburger Button */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#0f172a' }}
            aria-label="Open mobile navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              p: 2.5,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <ConstructionIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              AI-PAVE
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} size="small" aria-label="Close navigation menu">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ px: 0 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item)}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#334155',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isAuthenticated && user ? (
            <>
              <Box sx={{ p: 1.5, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {user.full_name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {user.email}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{ backgroundColor: '#0284c7', borderRadius: 2, py: 1 }}
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/signin"
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2, py: 1 }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                onClick={() => setMobileOpen(false)}
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#0284c7', borderRadius: 2, py: 1 }}
              >
                Create Account
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};
