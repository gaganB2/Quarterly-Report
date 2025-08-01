// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // While the authentication state is loading, show a spinner.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If loading is finished and there's no user, or the user is not an Admin, redirect.
  if (!user || user.role !== 'Admin') {
    // Redirect them to the home page, not the login page, as they might be a logged-in non-admin.
    return <Navigate to="/home" replace />;
  }

  // If the user is an Admin, render the requested component.
  return children;
}
