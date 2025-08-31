import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Alert, Stack, CircularProgress, Link, Box } from '@mui/material';
import apiClient from '../api/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await apiClient.post('/api/password-reset/request/', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, width: '100%' }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Reset Your Password
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your email address and we will send you a link to reset your password.
        </Typography>
        
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            fullWidth 
            disabled={!!message}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading || !!message}>
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" fontWeight="medium">
            &larr; Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}