import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import MemoryIcon from '@mui/icons-material/Memory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Analyze', path: '/analyze', icon: <SearchIcon fontSize="small" /> },
  { label: 'History', path: '/history', icon: <HistoryIcon fontSize="small" /> },
  { label: 'Models', path: '/models', icon: <MemoryIcon fontSize="small" /> },
  { label: 'Evaluation', path: '/evaluation', icon: <AssessmentIcon fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon fontSize="small" /> },
  { label: 'About', path: '/about', icon: <InfoIcon fontSize="small" /> },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  // Helper initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Logo & Title linking to landing page */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mr: 4,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#0f172a', lineHeight: 1.2 }}>
                  AI-PAVE
                </Typography>
                <Chip label="v1.0" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#f1f5f9' }} />
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: { xs: 'none', md: 'block' }, lineHeight: 1 }}>
                Pavement Inspection & Severity Assessment System
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  size="small"
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 1.5,
                    color: isActive ? '#0284c7' : '#475569',
                    backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#f0f9ff' : '#f8fafc',
                      color: isActive ? '#0284c7' : '#0f172a',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Action Elements: Operational status & User Profile / Login */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {/* System Status Pill */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, px: 1.5, py: 0.5, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                }}
              />
              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                System Ready
              </Typography>
            </Box>

            {/* Authenticated User or Login/Signup buttons */}
            {isAuthenticated && user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Tooltip title="User Profile & Settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    size="small"
                    aria-controls={openMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    sx={{ p: 0.5, border: '2px solid #e2e8f0', '&:hover': { borderColor: '#0284c7' } }}
                  >
                    <Avatar
                      src={user.avatar_url || undefined}
                      alt={user.full_name}
                      sx={{ width: 34, height: 34, bgcolor: '#0284c7', fontSize: '0.875rem', fontWeight: 700 }}
                    >
                      {getInitials(user.full_name)}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* Name & Role text on desktop */}
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', cursor: 'pointer' }} onClick={handleOpenUserMenu}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    {user.full_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'capitalize' }}>
                    {user.role} {user.auth_provider === 'google' ? '• Google' : ''}
                  </Typography>
                </Box>

                {/* User Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMenu}
                  onClose={handleCloseUserMenu}
                  onClick={handleCloseUserMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        width: 250,
                        borderRadius: 2.5,
                        mt: 1.5,
                        p: 1,
                        border: '1px solid #e2e8f0',
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {user.full_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', wordBreak: 'break-all' }}>
                      {user.email}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#f0f9ff', color: '#0284c7' }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" sx={{ color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary="System Settings" />
                  </MenuItem>

                  <MenuItem component={Link} to="/history" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" sx={{ color: '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Inspection History" />
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: '#dc2626' }} />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  component={Link}
                  to="/signin"
                  startIcon={<LoginIcon fontSize="small" />}
                  size="small"
                  sx={{
                    color: '#334155',
                    px: 1.5,
                    py: 0.7,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  startIcon={<PersonAddIcon fontSize="small" />}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    px: 1.8,
                    py: 0.7,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#0369a1',
                      boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
