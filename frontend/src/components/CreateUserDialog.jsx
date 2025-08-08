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
import * as yup from "yup"; // Import yup for validation

/**
 * A dialog component for creating a new user with client-side validation.
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.onClose - Function to call when the dialog should close.
 * @param {function} props.onSuccess - Function to call after a successful user creation.
 */
export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    prefix: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    department: "",
    role: "Faculty",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState({}); // State for validation errors

  // Validation schema using Yup
  const validationSchema = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
    department: yup.string().required("Department is required"),
    role: yup.string().required("Role is required"),
    prefix: yup.string().optional(),
    middle_name: yup.string().optional(),
  });

  useEffect(() => {
    if (open && departments.length === 0) {
      apiClient
        .get("/api/admin/departments/")
        .then((response) =>
          setDepartments(response.data.results || response.data)
        )
        .catch((err) => {
          console.error("Failed to fetch departments", err);
          setServerError("Could not load department list.");
        });
    }
  }, [open, departments.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for the field being edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      password: "",
      password2: "",
      prefix: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      department: "",
      role: "Faculty",
    });
    setFormErrors({});
    setServerError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});

    try {
      // Step 1: Perform client-side validation
      await validationSchema.validate(formData, { abortEarly: false });

      // Step 2: If validation is successful, proceed to API call
      setLoading(true);
      await apiClient.post("/api/register/", formData);
      onSuccess();
      handleClose();
    } catch (err) {
      // Handle Validation Errors
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setFormErrors(newErrors);
        return; // Stop the submission
      }

      // Handle API/Server Errors
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
      setServerError(`Failed to create user: ${errorMessage}`);
      console.error("Registration failed", err.response);
    } finally {
      setLoading(false);
    }
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
          {serverError && <Alert severity="error">{serverError}</Alert>}

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
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="middle_name"
                label="Middle Name"
                value={formData.middle_name}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.middle_name}
                helperText={formErrors.middle_name}
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
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
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
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            name="username"
            label="Username / Faculty ID"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            error={!!formErrors.username}
            helperText={formErrors.username}
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
                error={!!formErrors.password}
                helperText={formErrors.password}
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
                error={!!formErrors.password2}
                helperText={formErrors.password2}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth required error={!!formErrors.department}>
            <InputLabel>Department</InputLabel>
            <Select
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
            {formErrors.department && (
              <FormHelperText error>{formErrors.department}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!formErrors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
            {formErrors.role && (
              <FormHelperText error>{formErrors.role}</FormHelperText>
            )}
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
