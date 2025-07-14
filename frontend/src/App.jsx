// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginLanding from "./pages/LoginLanding";
import FacultyLogin from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";

// Route protection and layout
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <Routes>
      {/* Default route → login landing */}
      <Route path="/" element={<Navigate to="/start" replace />} />
      <Route path="/start" element={<LoginLanding />} />
      <Route path="/login/faculty" element={<FacultyLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />

      {/* Post-login dynamic homepage */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
