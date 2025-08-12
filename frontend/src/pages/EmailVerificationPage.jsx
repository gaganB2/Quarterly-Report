// frontend/src/pages/EmailVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import apiClient from '../api/axios';

export default function EmailVerificationPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await apiClient.post('/api/verify-email/', { uid, token });
        setStatus('success');
      } catch (err) {
        setErrorMessage(err.response?.data?.error || 'An unknown error occurred.');
        setStatus('error');
      }
    };
    verifyEmail();
  }, [uid, token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return <CircularProgress />;
      case 'success':
        return (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>Your account has been successfully activated!</Alert>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Proceed to Login
            </Button>
          </>
        );
      case 'error':
        return <Alert severity="error">{errorMessage}</Alert>;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Account Verification
        </Typography>
        {renderContent()}
      </Paper>
    </Container>
  );
}