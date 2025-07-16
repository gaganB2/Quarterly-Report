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

          {/* Combined Faculty/Admin login page */}
          <Route path="/start" element={<LoginLanding />} />

          {/* Protected home page */}
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
