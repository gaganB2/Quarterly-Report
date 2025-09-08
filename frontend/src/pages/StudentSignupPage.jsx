import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  keyframes,
  alpha,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../api/axios";
import * as yup from "yup";
import logo from "/assets/favicon.png";

const MotionPaper = motion(Paper);

const auroraVibrant = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", username: "",
    department: "", password: "", password2: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const theme = useTheme();

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
      await apiClient.post("/api/student/register/", formData);
      setSuccessMessage("Registration successful! Please check your email to verify and activate your account.");
      setFormData({
        first_name: "", last_name: "", email: "", username: "",
        department: "", password: "", password2: "",
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach(error => { newErrors[error.path] = error.message; });
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
        background: `linear-gradient(125deg, #E6F7FF, #EBF5FF, #F0F9FF, #F5F3FF, #E6F7FF)`,
        backgroundSize: '400% 400%',
        animation: `${auroraVibrant} 30s ease infinite`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <MotionPaper
          elevation={0}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(16px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img src={logo} alt="BIT Durg Logo" style={{ height: 50, marginBottom: '16px' }} />
            <Typography variant="h4" fontWeight={700}>
              Create Student Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join the portal to manage your reports.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <AnimatePresence>
              {serverError && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><Alert severity="error" variant="filled" sx={{mb: 2}}>{serverError}</Alert></motion.div>}
              {successMessage && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><Alert severity="success" variant="filled" sx={{mb: 2}}>{successMessage}</Alert></motion.div>}
            </AnimatePresence>

            {/* --- FIX: A single, unified Grid container for the entire form --- */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField name="first_name" label="First Name" fullWidth value={formData.first_name} onChange={handleChange} error={!!formErrors.first_name} helperText={formErrors.first_name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="last_name" label="Last Name" fullWidth value={formData.last_name} onChange={handleChange} error={!!formErrors.last_name} helperText={formErrors.last_name} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="email" label="Email Address" type="email" fullWidth value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="username" label="Admission/Roll No." fullWidth value={formData.username} onChange={handleChange} error={!!formErrors.username} helperText={formErrors.username} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select name="department" value={formData.department} label="Department" onChange={handleChange}>
                    {departments.map((dept) => (<MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>))}
                  </Select>
                  {formErrors.department && <FormHelperText>{formErrors.department}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="password2" label="Confirm Password" type="password" fullWidth value={formData.password2} onChange={handleChange} error={!!formErrors.password2} helperText={formErrors.password2} />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !!successMessage} 
              sx={{ py: 1.5, mt: 3, borderRadius: '99px', fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>

            <Typography variant="body2" sx={{ pt: 3, textAlign: "center" }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login/student" fontWeight="bold">
                Login
              </Link>
            </Typography>
          </form>
        </MotionPaper>
      </Container>
    </Box>
  );
}