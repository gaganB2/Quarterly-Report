import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import T1ResearchForm from "./pages/T1ResearchForm";
import T1ResearchList from "./pages/T1ResearchList"; // ✅ New

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/submit-t1"
        element={
          <PrivateRoute>
            <T1ResearchForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-submissions"
        element={
          <PrivateRoute>
            <T1ResearchList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
