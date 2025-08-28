// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, useTheme, alpha } from '@mui/material'; // Import alpha for color manipulation

// Components
import Topbar from './components/Topbar';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForcePasswordChangePage from './pages/ForcePasswordChangePage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import StudentDashboard from './pages/StudentDashboard';

// Route protection
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import StudentRoute from './routes/StudentRoute';

export default function App() {
  const location = useLocation();
  const theme = useTheme();

  const isPublicAuthPage = ['/', '/login', '/login/student', '/signup'].includes(location.pathname);
  const isEmailVerification = location.pathname.startsWith('/verify-email');
  const isPublicPage = isPublicAuthPage || isEmailVerification;

  // --- THIS IS THE UI ENHANCEMENT ---
  // A more vibrant, multi-layered radial gradient background.
  const backgroundStyles = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.palette.background.default, // Fallback color
    // This creates soft, colored glows at the corners of the screen.
    backgroundImage: `
      radial-gradient(at 20% 25%, ${alpha(theme.palette.primary.main, 0.15)} 0px, transparent 50%),
      radial-gradient(at 80% 20%, ${alpha(theme.palette.success.main, 0.15)} 0px, transparent 50%),
      radial-gradient(at 25% 85%, ${alpha(theme.palette.warning.main, 0.15)} 0px, transparent 50%),
      radial-gradient(at 80% 80%, ${alpha(theme.palette.error.main, 0.15)} 0px, transparent 50%)
    `,
    backgroundSize: '100% 100%',
    backgroundAttachment: 'fixed',
  };

  return (
    <Box sx={backgroundStyles}>
      {!isPublicPage && <Topbar />}
      <Box sx={!isPublicPage ? { pt: { xs: 8, md: 10 } } : {}}>
        <Routes>
          {/* --- All Route components remain the same --- */}
          <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login/student" element={<PublicRoute><StudentLoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><StudentSignupPage /></PublicRoute>} />
          <Route path="/verify-email/:uid/:token" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/force-password-change" element={<PrivateRoute><ForcePasswordChangePage /></PrivateRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/departments" element={<AdminRoute><DepartmentManagement /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
          <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}