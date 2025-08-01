// src/pages/DepartmentManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import apiClient from '../api/axios';

// --- Define the correct, new API endpoint ---
const DEPARTMENTS_API_URL = '/api/admin/departments/';

const DepartmentDialog = ({ open, onClose, onSave, department }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isEditMode = department && department.id;

  useEffect(() => {
    if (open) {
      setName(isEditMode ? department.name : '');
      setError('');
    }
  }, [open, department, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isEditMode ? `${DEPARTMENTS_API_URL}${department.id}/` : DEPARTMENTS_API_URL;
    const method = isEditMode ? 'put' : 'post';

    try {
      await apiClient[method](url, { name });
      onSave();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.name?.[0] || 'An error occurred.';
      setError(`Failed to save department: ${errorMsg}`);
      console.error('Save department error:', err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Edit Department' : 'Create New Department'}</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 2 }} id="department-form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            name="name"
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="department-form" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogState, setDialogState] = useState({ open: false, department: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, department: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(DEPARTMENTS_API_URL);
      setDepartments(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
      setError('Could not load department data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSaveSuccess = () => {
    setSnackbar({ open: true, message: 'Department saved successfully!', severity: 'success' });
    fetchDepartments();
  };

  const handleDelete = async () => {
    if (!confirmDelete.department) return;
    try {
      await apiClient.delete(`${DEPARTMENTS_API_URL}${confirmDelete.department.id}/`);
      setSnackbar({ open: true, message: 'Department deleted successfully!', severity: 'success' });
      fetchDepartments();
    } catch (err) {
      console.error("Failed to delete department", err);
      setSnackbar({ open: true, message: 'Failed to delete department.', severity: 'error' });
    } finally {
      setConfirmDelete({ open: false, department: null });
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Department Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogState({ open: true, department: null })}
            >
              New Department
            </Button>
          </Box>

          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!loading && !error && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Department Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id} hover>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => setDialogState({ open: true, department: dept })}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setConfirmDelete({ open: true, department: dept })} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <DepartmentDialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false, department: null })}
        onSave={handleSaveSuccess}
        department={dialogState.department}
      />

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, department: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the department "<strong>{confirmDelete.department?.name}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, department: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
