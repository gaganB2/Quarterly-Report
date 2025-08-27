// frontend/src/pages/ForcePasswordChangePage.jsx

import React, { useState } from 'react'; // --- THIS IS THE FIX: 'useState' is now imported ---
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Stack,
  CircularProgress, Alert, Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiClient from '../api/axios';

// Validation schema using yup
const validationSchema = yup.object({
  new_password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirm_password: yup.string()
    .oneOf([yup.ref('new_password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

export default function ForcePasswordChangePage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onFormSubmit = async (data) => {
    setError('');
    setSuccess('');
    
    try {
      await apiClient.post('/api/set-password/', { new_password: data.new_password });

      setSuccess('Password changed successfully! Redirecting you to the home page...');
      
      updateUser({ requires_password_change: false });
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
      console.error("Password change failed:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          For your security, you must change the temporary password provided by the administrator.
        </Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit(onFormSubmit)}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            {...register("new_password")}
            label="New Password"
            type="password"
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            required
            fullWidth
          />
          <TextField
            {...register("confirm_password")}
            label="Confirm New Password"
            type="password"
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            required
            fullWidth
          />
          <Box sx={{ pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !!success}
              size="large"
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Set New Password'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}