// src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect private routes.
 * 1. If the user is not logged in, it redirects them to the login page.
 * 2. If the user IS logged in but HAS a temporary password, it redirects them to the password change page.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if the user is fully authenticated.
 */
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // If there is no user, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // --- THIS IS THE NEW LOGIC ---
  // Check if the user is required to change their password.
  // We also check that they aren't already ON the password change page to avoid an infinite redirect loop.
  if (user.requires_password_change && location.pathname !== '/force-password-change') {
    return <Navigate to="/force-password-change" replace />;
  }
  
  // If the user exists and does not need to change their password, render the requested page.
  return children;
}