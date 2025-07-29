// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    // If the user is logged in, redirect them away from the public page (e.g., login)
    // to the main application homepage.
    return <Navigate to="/home" replace />;
  }

  // If the user is not logged in, render the public page as requested.
  return children;
}
