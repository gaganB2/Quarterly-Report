// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import Topbar from './components/Topbar';

// Pages
import LoginLanding from './pages/LoginLanding';
import HomePage from './pages/HomePage';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';

// Route protection
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';

export default function App() {
  return (
    <Box>
      <Topbar />
      <Box sx={{ pt: { xs: 10, md: 12 } }}>
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />

          <Route
            path="/start"
            element={
              <PublicRoute>
                <LoginLanding />
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

          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
