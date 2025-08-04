// src/routes/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Paper, Container } from '@mui/material';

/**
 * A component to protect admin-only routes.
 * It checks for two conditions:
 * 1. Is the user logged in?
 * 2. Does the logged-in user have the 'Admin' role?
 * If either check fails, it redirects or shows an error.
 * @param {object} props
 * @param {React.ReactNode} props.children - The admin component to render if authorized.
 */
export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Check 1: Is the user logged in? If not, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check 2: Is the logged-in user an Admin?
  if (user.role === 'Admin') {
    // If yes, render the requested admin page.
    return children;
  } else {
    // If they are logged in but NOT an admin, show an "Access Denied" message.
    // This is better than redirecting to a generic page, as it provides clear feedback.
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You do not have the necessary permissions to view this page.
          </Typography>
        </Paper>
      </Container>
    );
  }
}