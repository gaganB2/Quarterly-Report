// src/components/CreateUserDialog.jsx
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import apiClient from "../api/axios";

// src/components/CreateUserDialog.jsx

const initialFormState = {
  username: "",
  password: "",
  password2: "",
  prefix: "", // <-- Add this
  first_name: "",
  middle_name: "", // <-- Add this
  last_name: "",
  email: "",
  department: "",
  role: "Faculty",
};

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (departments.length === 0) {
        apiClient
          .get("/api/admin/departments/")
          .then((response) => {
            setDepartments(response.data.results || response.data);
          })
          .catch((err) => {
            console.error("Failed to fetch departments", err);
            setError("Could not load department list.");
          });
      }
    }
  }, [open, departments.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/api/register/", formData);
      onSuccess();
      handleClose();
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData
        ? Object.entries(errorData)
            .map(
              ([field, errors]) =>
                `${field.replace("_", " ")}: ${
                  Array.isArray(errors) ? errors.join(" ") : errors
                }`
            )
            .join(" | ")
        : "An unknown error occurred.";
      setError(`Failed to create user: ${errorMessage}`);
      console.error("Registration failed", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          spacing={2}
          sx={{ mt: 2 }}
          id="create-user-form"
          onSubmit={handleSubmit}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Prefix</InputLabel>
                <Select
                  name="prefix"
                  value={formData.prefix}
                  label="Prefix"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                  <MenuItem value="Prof.">Prof.</MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="middle_name"
                label="Middle Name"
                value={formData.middle_name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <TextField
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            name="username"
            label="Username / Faculty ID"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password2"
                label="Confirm Password"
                type="password"
                value={formData.password2}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <FormControl fullWidth required variant="outlined">
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
          <FormControl fullWidth required variant="outlined">
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
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-user-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
