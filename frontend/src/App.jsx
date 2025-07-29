// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import Topbar from './components/Topbar';

// Pages
import LoginLanding from './pages/LoginLanding';
import HomePage     from './pages/HomePage';

// Route protection
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute'; // <-- 1. Import PublicRoute

export default function App() {
  return (
    <Box>
      {/* Global glass Topbar */}
      <Topbar />

      {/* Push all pages below the Topbar */}
      <Box sx={{ pt: { xs: 10, md: 12 } }}>
        <Routes>
          {/* Redirect root to landing */}
          <Route path="/" element={<Navigate to="/start" replace />} />

          {/* 2. Use PublicRoute for the login page */}
          <Route
            path="/start"
            element={
              <PublicRoute>
                <LoginLanding />
              </PublicRoute>
            }
          />

          {/* Protected home page (remains unchanged) */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
