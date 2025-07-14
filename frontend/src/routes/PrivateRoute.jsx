// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Faculty or HOD

  if (!token) {
    return <Navigate to="/start" replace />;
  }

  // You can optionally redirect based on role:
  // if (window.location.pathname === '/login/admin' && role !== 'Admin') {
  //   return <Navigate to="/start" replace />;
  // }

  return children;
}
