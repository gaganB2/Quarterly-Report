// src/pages/StudentSignupPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
} from "@mui/material";
import { motion } from "framer-motion";
import apiClient from "../api/axios";
import * as yup from "yup";
import logo from "/assets/favicon.png";

const MotionPaper = motion(Paper);

// FIX: Updated validation schema to match the backend serializer
const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  username: yup.string().required("Admission/Roll No. is required"),
  department: yup.string().required("Department is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  password2: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Password confirmation is required'),
});

export default function StudentSignupPage() {
  // FIX: Updated form state to use 'username' directly
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "", // This is now the field for Admission/Roll No.
    department: "",
    password: "",
    password2: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    apiClient.get("/api/public/departments/") 
      .then(res => setDepartments(res.data.results || res.data))
      .catch(err => {
        console.error("Failed to fetch departments", err);
        setServerError("Could not load department list. Please try again later.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setFormErrors({});

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      // The backend endpoint remains the same
      await apiClient.post("/api/student/register/", formData);
      setSuccessMessage("Registration successful! Please check your email to verify and activate your account.");
      // Reset form on success
      setFormData({
        first_name: "", last_name: "", email: "", username: "",
        department: "", password: "", password2: "",
      });

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setFormErrors(newErrors);
      } else {
        const errorData = err.response?.data;
        const errorMessage = errorData ? Object.entries(errorData).map(([field, errors]) => `${field.replace("_", " ")}: ${Array.isArray(errors) ? errors.join(' ') : errors}`).join(' | ') : "An unknown error occurred.";
        setServerError(`Registration failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <MotionPaper
          elevation={12}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ p: 4, borderRadius: 4, textAlign: "center" }}
        >
          <img src={logo} alt="BIT Durg Logo" style={{ height: 60, marginBottom: '16px' }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Create Student Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join the portal to manage your reports.
          </Typography>

          <Stack
            spacing={2}
            component="form"
            onSubmit={handleSubmit}
          >
            {serverError && <Alert severity="error">{serverError}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField name="first_name" label="First Name" fullWidth value={formData.first_name} onChange={handleChange} error={!!formErrors.first_name} helperText={formErrors.first_name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="last_name" label="Last Name" fullWidth value={formData.last_name} onChange={handleChange} error={!!formErrors.last_name} helperText={formErrors.last_name} />
              </Grid>
            </Grid>
            
            <TextField name="email" label="Email Address" type="email" fullWidth value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email} />
            
            {/* FIX: This TextField now correctly uses name="username" */}
            <TextField name="username" label="Admission/Roll No." fullWidth value={formData.username} onChange={handleChange} error={!!formErrors.username} helperText={formErrors.username} />
            
            <FormControl fullWidth error={!!formErrors.department}>
              <InputLabel>Department</InputLabel>
              <Select name="department" value={formData.department} label="Department" onChange={handleChange}>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
              {formErrors.department && <FormHelperText>{formErrors.department}</FormHelperText>}
            </FormControl>

            <TextField name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password} />
            <TextField name="password2" label="Confirm Password" type="password" fullWidth value={formData.password2} onChange={handleChange} error={!!formErrors.password2} helperText={formErrors.password2} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !!successMessage} 
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>

            <Typography variant="body2" sx={{ pt: 2 }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login/student" fontWeight="bold">
                Login
              </Link>
            </Typography>
          </Stack>
        </MotionPaper>
      </Container>
    </Box>
  );
}
