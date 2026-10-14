import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { Models } from './pages/Models';
import { Evaluation } from './pages/Evaluation';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

/**
 * Standard Application Layout for Dashboard and Analysis Pages
 * Preserves existing Navbar, max-width Container, and Application Footer
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
    <Navbar />
    <Container maxWidth="xl" component="main" sx={{ flexGrow: 1, py: 3.5, px: { xs: 2, sm: 3 } }}>
      {children}
    </Container>
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'xl', mx: 'auto' }}>
        <Box sx={{ fontSize: '0.75rem', color: '#64748b' }}>
          AI-PAVE Road Inspection & Pavement Maintenance Recommendation System
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Civil Engineering Decision Support • Deterministic Heuristics
        </Box>
      </Box>
    </Box>
  </Box>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page at '/' */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Working Application Routes */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/analyze"
              element={
                <AppLayout>
                  <Analyze />
                </AppLayout>
              }
            />
            <Route
              path="/results/:id"
              element={
                <AppLayout>
                  <Results />
                </AppLayout>
              }
            />
            <Route path="/results" element={<Navigate to="/history" replace />} />
            <Route
              path="/history"
              element={
                <AppLayout>
                  <History />
                </AppLayout>
              }
            />
            <Route
              path="/models"
              element={
                <AppLayout>
                  <Models />
                </AppLayout>
              }
            />
            <Route
              path="/evaluation"
              element={
                <AppLayout>
                  <Evaluation />
                </AppLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />
            <Route
              path="/about"
              element={
                <AppLayout>
                  <About />
                </AppLayout>
              }
            />

            {/* Fallback to Public Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
