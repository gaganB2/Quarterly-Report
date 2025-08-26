// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, useTheme } from '@mui/material'; // Import useTheme

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
  const theme = useTheme(); // Access the theme for background colors

  const isPublicAuthPage = ['/', '/login', '/login/student', '/signup'].includes(location.pathname);
  const isEmailVerification = location.pathname.startsWith('/verify-email');
  const isPublicPage = isPublicAuthPage || isEmailVerification;

  // --- FIX: Define the background style for our glassmorphism effect ---
  const backgroundStyles = {
    minHeight: '100vh',
    width: '100%',
    // A subtle, modern gradient that works for both light and dark themes
    backgroundImage: `linear-gradient(120deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed', // Keeps the background static while content scrolls
  };

  return (
    // This outer Box is now the main application container with our new background
    <Box sx={backgroundStyles}>
      {!isPublicPage && <Topbar />}
      <Box sx={!isPublicPage ? { pt: { xs: 8, md: 10 } } : {}}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/login/student" element={<PublicRoute><StudentLoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><StudentSignupPage /></PublicRoute>} />
          <Route path="/verify-email/:uid/:token" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />

          {/* --- Private Routes --- */}
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/force-password-change" element={<PrivateRoute><ForcePasswordChangePage /></PrivateRoute>} />

          {/* --- Admin Routes --- */}
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/departments" element={<AdminRoute><DepartmentManagement /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
          
          {/* --- Student Routes --- */}
          <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />

          {/* --- Catch-all redirects to the root --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}