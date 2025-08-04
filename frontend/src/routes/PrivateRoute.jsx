// src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect private routes.
 * If the user is not logged in, it redirects them to the login page.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if the user is authenticated.
 */
export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  // If a user object exists, they are logged in, so render the requested page.
  if (user) {
    return children;
  }

  // If there is no user, redirect them to the login page.
  return <Navigate to="/login" replace />;
}