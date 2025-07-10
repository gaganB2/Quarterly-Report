import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
import Dashboard from './pages/Dashboard'; // <-- Use this one!

import T1ResearchForm from "./pages/T1ResearchForm";
import T1ResearchList from "./pages/T1ResearchList";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";


export default function App() {
  return (
    <Routes>
      {/* Public Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/submit-t1"
        element={
          <PrivateRoute>
            <MainLayout>
              <T1ResearchForm />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/my-submissions"
        element={
          <PrivateRoute>
            <MainLayout>
              <T1ResearchList />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Redirect any unknown paths to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
