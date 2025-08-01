// src/components/CreateUserDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import apiClient from '../api/axios';

const initialFormState = {
  username: '',
  password: '',
  password2: '',
  department: '',
  role: 'Faculty',
};

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      apiClient.get('/api/admin/departments/')
        .then(response => {
          setDepartments(response.data.results || response.data);
        })
        .catch(err => {
          console.error("Failed to fetch departments", err);
          setError('Could not load department list.');
        });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/api/register/', formData);
      onSuccess();
      handleClose();
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : 'An unknown error occurred.';
      setError(`Failed to create user: ${errorMessage}`);
      console.error("Registration failed", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter backdrop
          backdropFilter: 'blur(2px)',
        },
      }}
      PaperProps={{
        elevation: 8,
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 2 }} id="create-user-form" onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            name="username"
            label="Username / Faculty ID"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="password2"
            label="Confirm Password"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel id="department-select-label">Department</InputLabel>
            <Select
              labelId="department-select-label"
              name="department"
              value={formData.department}
              label="Department"
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button
          type="submit"
          form="create-user-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}