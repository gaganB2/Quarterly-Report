// src/routes/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect public routes.
 * If the user is logged in, it redirects them to their default home page
 * to prevent them from seeing pages like the login/welcome screen again.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if the user is not authenticated.
 */
export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // If a user object exists, they are logged in.
  if (user) {
    // Redirect admins to their dashboard, others to the faculty homepage.
    const redirectTo = user.role === 'Admin' ? '/admin/users' : '/home';
    return <Navigate to={redirectTo} replace />;
  }

  // If there is no user, render the requested public page (e.g., Welcome or Login).
  return children;
}