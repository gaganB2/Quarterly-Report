import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import T1ResearchForm from './pages/T1ResearchForm';
import T1ResearchList from './pages/T1ResearchList';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layout/MainLayout';

function App({ mode, setMode }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout mode={mode} setMode={setMode}>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/submit-t1"
        element={
          <PrivateRoute>
            <MainLayout mode={mode} setMode={setMode}>
              <T1ResearchForm />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/my-submissions"
        element={
          <PrivateRoute>
            <MainLayout mode={mode} setMode={setMode}>
              <T1ResearchList />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
