// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import ForcePasswordChangePage from './pages/ForcePasswordChangePage';

// NEW: Student Pages
import StudentLoginPage from './pages/StudentLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import StudentDashboard from './pages/StudentDashboard';

// Route protection
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
// NEW: Student Route Guard
import StudentRoute from './routes/StudentRoute';

export default function App() {
  const location = useLocation();
  // The Topbar is now hidden on all public auth pages.
  const isPublicAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/login/student' || location.pathname === '/signup' ;
  const isEmailVerification = location.pathname.startsWith('/verify-email');
  const isPublicPage = isPublicAuthPage || isEmailVerification;


  return (
    <Box>
      {!isPublicPage && <Topbar />}
      <Box sx={!isPublicPage ? { pt: { xs: 8, md: 10 } } : {}}>
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

          {/* NEW: Public Student Routes */}
          <Route
            path="/login/student"
            element={<PublicRoute><StudentLoginPage /></PublicRoute>}
          />
          <Route
            path="/signup"
            element={<PublicRoute><StudentSignupPage /></PublicRoute>}
          />
          {/* Email verification can be public */}
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
          
          {/* NEW: Student Routes */}
          <Route
            path="/student/dashboard"
            element={<StudentRoute><StudentDashboard /></StudentRoute>}
          />


          {/* --- Catch-all redirects to the root --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}