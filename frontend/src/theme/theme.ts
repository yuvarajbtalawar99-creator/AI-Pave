import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0284c7', // Professional technical cyan/blue
      dark: '#0369a1',
      light: '#38bdf8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569', // Slate
    },
    background: {
      default: '#f8fafc', // Very subtle neutral gray
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    error: {
      main: '#dc2626', // Critical
    },
    warning: {
      main: '#ea580c', // High
    },
    info: {
      main: '#0284c7', // Medium
    },
    success: {
      main: '#16a34a', // Low
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' },
    h2: { fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' },
    h3: { fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' },
    h4: { fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' },
    h5: { fontSize: '1rem', fontWeight: 600, color: '#0f172a' },
    h6: { fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' },
    body1: { fontSize: '0.875rem', color: '#1e293b' },
    body2: { fontSize: '0.8125rem', color: '#475569' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 14px',
          borderColor: '#e2e8f0',
          fontSize: '0.8125rem',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          color: '#334155',
        },
      },
    },
  },
});
