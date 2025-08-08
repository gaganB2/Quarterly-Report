// frontend/src/components/EditUserDialog.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert,
  Stack, Grid, FormControlLabel, Switch, IconButton, Box
} from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import apiClient from '../api/axios';

// --- A small, self-contained component for the password reset dialog ---
const ResetPasswordDialog = ({ open, onClose, userId }) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      setPassword('');
      setPassword2('');
      setError('');
      setSuccess('');
    }
  }, [open]);

  const handleReset = async () => {
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.post(`/api/admin/users/${userId}/set-password/`, { password });
      setSuccess("Password reset successfully!");
      setTimeout(onClose, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "An unknown error occurred.";
      setError(Array.isArray(errorMsg) ? errorMsg.join(' ') : errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1, minWidth: 300 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            autoFocus
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            type="password"
            label="Confirm New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleReset} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Confirm Reset"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// --- The main EditUserDialog component ---
const EditUserDialog = ({ user, open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      apiClient.get('/api/admin/departments/')
        .then(res => setDepartments(res.data.results || res.data))
        .catch(err => console.error("Failed to fetch departments", err));
    }
  }, [open]);

  useEffect(() => {
    // Check if user and departments are available before setting form data
    if (user && departments.length > 0) {
      const userDept = departments.find(d => d.name === user.department);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        department: userDept ? userDept.id : '',
        role: user.role || 'Faculty',
        is_active: user.is_active,
        prefix: user.prefix || '',
        middle_name: user.middle_name || '',
      });
    } else if (user) {
        // Handle case where departments haven't loaded yet but user is present
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            department: '', // department ID is unknown yet
            role: user.role || 'Faculty',
            is_active: user.is_active,
            prefix: user.prefix || '',
            middle_name: user.middle_name || '',
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
      await apiClient.patch(`/api/admin/users/${user.id}/`, formData);
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
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User: {user?.username}</DialogTitle>
        <DialogContent>
          <Stack component="form" spacing={2} sx={{ mt: 2 }} id="edit-user-form" onSubmit={handleSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField name="username" label="Username" value={user?.username || ''} disabled fullWidth />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Prefix</InputLabel>
                  <Select name="prefix" value={formData.prefix || ''} label="Prefix" onChange={handleChange}>
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value="Dr.">Dr.</MenuItem>
                      <MenuItem value="Prof.">Prof.</MenuItem>
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Mrs.">Mrs.</MenuItem>
                      <MenuItem value="Ms.">Ms.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                  <TextField name="first_name" label="First Name" value={formData.first_name || ''} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField name="middle_name" label="Middle Name" value={formData.middle_name || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField name="last_name" label="Last Name" value={formData.last_name || ''} onChange={handleChange} required fullWidth />
              </Grid>
            </Grid>

            <TextField name="email" label="Email Address" type="email" value={formData.email || ''} onChange={handleChange} required fullWidth />
            
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select name="department" value={formData.department || ''} label="Department" onChange={handleChange}>
                {departments.map((dept) => <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role || ''} label="Role" onChange={handleChange}>
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
        <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
          <Button onClick={() => setPasswordDialogOpen(true)} color="secondary" startIcon={<LockResetIcon />}>
            Reset Password
          </Button>
          <Box>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button type="submit" form="edit-user-form" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      
      <ResetPasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        userId={user?.id}
      />
    </>
  );
};

export default EditUserDialog;