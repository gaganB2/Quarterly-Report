// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

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
import ForcePasswordChangePage from './pages/ForcePasswordChangePage'; // The new import

// Route protection
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';

export default function App() {
  return (
    <Box>
      <Topbar />
      <Box sx={{ pt: { xs: 8, md: 10 } }}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route 
            path="/" 
            element={<PublicRoute><WelcomePage /></PublicRoute>} 
          />
          <Route
            path="/login"
            element={<PublicRoute><LoginPage /></PublicRoute>}
          />
          <Route 
            path="/verify-email/:uid/:token"
            element={<PublicRoute><EmailVerificationPage /></PublicRoute>} 
          />

          {/* --- Private Routes --- */}
          <Route
            path="/home"
            element={<PrivateRoute><HomePage /></PrivateRoute>}
          />
          <Route
            path="/force-password-change"
            element={<PrivateRoute><ForcePasswordChangePage /></PrivateRoute>}
          />

          {/* --- Admin Routes --- */}
          <Route
            path="/admin/users"
            element={<AdminRoute><UserManagement /></AdminRoute>}
          />
          <Route
            path="/admin/departments"
            element={<AdminRoute><DepartmentManagement /></AdminRoute>}
          />
          <Route
            path="/admin/analytics"
            element={<AdminRoute><AnalyticsDashboard /></AdminRoute>}
          />

          {/* --- Catch-all redirects to the root --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}