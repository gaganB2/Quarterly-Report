// src/components/EditUserDialog.jsx
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
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import apiClient from '../api/axios';

const EditUserDialog = ({ user, open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      apiClient.get('/api/admin/departments/')
        .then(res => setDepartments(res.data.results || res.data))
        .catch(err => console.error("Failed to fetch departments", err));
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      let initialDeptId = '';
      if (user.department && user.role !== 'Admin' && departments.length > 0) {
        const userDept = departments.find(d => d.name === user.department);
        if (userDept) {
          initialDeptId = userDept.id;
        }
      }
      
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        department: initialDeptId,
        role: user.role || 'Faculty',
        is_active: user.is_active,
      });
    }
    setError('');
  }, [user, open, departments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'switch' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.put(`/api/admin/users/${user.id}/`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData ? JSON.stringify(errorData) : 'An unknown error occurred.';
      setError(`Failed to update user: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User: {user?.username}</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 2 }} id="edit-user-form" onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField name="username" label="Username" value={user?.username || ''} disabled fullWidth variant="outlined" />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="first_name" label="First Name" value={formData.first_name || ''} onChange={handleChange} required fullWidth variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="last_name" label="Last Name" value={formData.last_name || ''} onChange={handleChange} required fullWidth variant="outlined" />
            </Grid>
          </Grid>

          <TextField name="email" label="Email Address" type="email" value={formData.email || ''} onChange={handleChange} required fullWidth variant="outlined" />
          
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="edit-department-label">Department</InputLabel>
            <Select
              labelId="edit-department-label"
              name="department"
              value={formData.department || ''}
              label="Department"
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required variant="outlined">
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              name="role"
              value={formData.role || ''}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={<Switch checked={formData.is_active || false} onChange={handleChange} name="is_active" />}
            label="User is Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="edit-user-form" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;