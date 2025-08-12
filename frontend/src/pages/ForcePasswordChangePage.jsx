// frontend/src/pages/ForcePasswordChangePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Stack,
  CircularProgress, Alert, Box,
} from '@mui/material';
import apiClient from '../api/axios';
import * as yup from 'yup';

// Validation schema for the password form
const validationSchema = yup.object({
  new_password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirm_password: yup.string()
    .oneOf([yup.ref('new_password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

export default function ForcePasswordChangePage() {
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // We need logout if the token expires

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setLoading(true);

      // We need a separate API endpoint for this. Let's assume it will be '/api/set-password/'
      // This endpoint should only be accessible by authenticated users.
      await apiClient.post('/api/set-password/', { new_password: formData.new_password });

      setSuccess('Password changed successfully! You will be logged out and can now log in with your new password.');
      
      // After success, log the user out and redirect them to the login page.
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000); // Wait 3 seconds to let the user read the message

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setFormErrors(newErrors);
      } else {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
        console.error("Password change failed:", err);
      }
    } finally {
      setLoading(false);
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

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            name="new_password"
            label="New Password"
            type="password"
            value={formData.new_password}
            onChange={handleChange}
            error={!!formErrors.new_password}
            helperText={formErrors.new_password}
            required
            fullWidth
          />
          <TextField
            name="confirm_password"
            label="Confirm New Password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={!!formErrors.confirm_password}
            helperText={formErrors.confirm_password}
            required
            fullWidth
          />
          <Box sx={{ pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Set New Password'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}