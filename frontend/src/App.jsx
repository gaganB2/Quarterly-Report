// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import Topbar from './components/Topbar';

// Pages
import WelcomePage from './pages/WelcomePage'; // <-- IMPORT NEW
import LoginPage from './pages/LoginPage'; // <-- IMPORT RENAMED
import HomePage from './pages/HomePage';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard'; // <-- IMPORT Analytics

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
          {/* --- MODIFIED: Root now points to WelcomePage --- */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <WelcomePage />
              </PublicRoute>
            } 
          />

          {/* --- MODIFIED: Login is now at /login --- */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* --- Admin Routes --- */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <AdminRoute>
                <DepartmentManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AnalyticsDashboard />
              </AdminRoute>
            }
          />

          {/* --- MODIFIED: Catch-all redirects to the new root --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
