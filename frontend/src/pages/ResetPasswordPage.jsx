import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Alert, Stack, CircularProgress, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../api/axios';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
}).refine(data => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
});

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');
    try {
      const response = await apiClient.post('/api/password-reset/confirm/', { uid, token, password: data.password });
      setSuccessMessage(response.data.message + " Redirecting to login in 3 seconds...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorData = err.response?.data?.error;
      const errorMessage = Array.isArray(errorData) ? errorData.join(' ') : errorData || 'Failed to reset password.';
      setServerError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, width: '100%' }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Create New Password
        </Typography>
        
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            {...register('password')}
            label="New Password" 
            type="password" 
            error={!!errors.password}
            helperText={errors.password?.message}
            required 
            fullWidth 
          />
          <TextField 
            {...register('password2')}
            label="Confirm New Password" 
            type="password"
            error={!!errors.password2}
            helperText={errors.password2?.message}
            required 
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting || !!successMessage}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Set New Password'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}