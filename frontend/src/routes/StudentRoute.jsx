// src/routes/StudentRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Paper, Typography } from '@mui/material';

/**
 * A component to protect student-only routes.
 * It checks if a user is logged in and if their role is 'Student'.
 * @param {object} props
 * @param {React.ReactNode} props.children - The student component to render if authorized.
 */
export default function StudentRoute({ children }) {
  const { user } = useAuth();

  // 1. If no user is logged in, redirect to the student login page.
  if (!user) {
    return <Navigate to="/login/student" replace />;
  }

  // 2. If the user's role is 'Student', render the page.
  if (user.role === 'Student') {
    return children;
  } 
  
  // 3. If logged in but not a student, show an access denied message.
  else {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            This page is only accessible to students. Please log in with a student account.
          </Typography>
        </Paper>
      </Container>
    );
  }
}