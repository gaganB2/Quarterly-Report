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
  Grid,
  alpha,
  useTheme,
  FormHelperText,
  InputAdornment,
  Box,
} from "@mui/material";
// --- NEW: Importing the 'sharp' icon variants for a modern look ---
import { 
  PersonAddSharp as PersonAddIcon, 
  BadgeSharp as BadgeIcon, 
  AlternateEmailSharp as EmailIcon, 
  VpnKeySharp as KeyIcon, 
  BusinessSharp as DepartmentIcon,
  GroupsSharp as RoleIcon,
  CategorySharp as PrefixIcon
} from '@mui/icons-material';
import apiClient from "../api/axios";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";

const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  password2: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Password confirmation is required"),
  department: yup.string().when('role', {
    is: (role) => ['Faculty', 'HOD', 'Student'].includes(role),
    then: (schema) => schema.required("Department is required for this role"),
    otherwise: (schema) => schema.notRequired(),
  }),
  role: yup.string().required("Role is required"),
  prefix: yup.string().optional(),
  middle_name: yup.string().optional(),
});

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "", password: "", password2: "", prefix: "", first_name: "",
    middle_name: "", last_name: "", email: "", department: "", role: "Faculty",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      // Reset form state every time the dialog opens
      setFormData({
        username: "", password: "", password2: "", prefix: "", first_name: "",
        middle_name: "", last_name: "", email: "", department: "", role: "Faculty",
      });
      setFormErrors({});
      setServerError("");
      if (departments.length === 0) {
        apiClient.get("/api/admin/departments/")
          .then((response) => setDepartments(response.data.results || response.data))
          .catch((err) => setServerError("Could not load department list."));
      }
    }
  }, [open, departments.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      await apiClient.post("/api/register/", formData);
      onSuccess();
      handleClose();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => { newErrors[error.path] = error.message; });
        setFormErrors(newErrors);
        return;
      }
      const errorData = err.response?.data;
      const errorMessage = errorData
        ? Object.entries(errorData)
            .map(([field, errors]) => `${field.replace("_", " ")}: ${Array.isArray(errors) ? errors.join(" ") : errors}`)
            .join(" | ")
        : "An unknown error occurred.";
      setServerError(`Failed to create user: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // --- FIX: Changed to 'md' for a wider, rectangular layout ---
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, fontSize: '1.5rem', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <PersonAddIcon color="primary" />
        Create New User
      </DialogTitle>
      <DialogContent sx={{py: 3}}>
        <form id="create-user-form" onSubmit={handleSubmit}>
          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert severity="error" variant="filled" sx={{ mt: 2, mb: 1 }}>{serverError}</Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Prefix</InputLabel>
                <Select name="prefix" value={formData.prefix} label="Prefix" onChange={handleChange} startAdornment={<InputAdornment position="start"><PrefixIcon /></InputAdornment>}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                  <MenuItem value="Prof.">Prof.</MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <TextField name="first_name" label="First Name *" value={formData.first_name} onChange={handleChange} fullWidth error={!!formErrors.first_name} helperText={formErrors.first_name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="middle_name" label="Middle Name" value={formData.middle_name} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="last_name" label="Last Name *" value={formData.last_name} onChange={handleChange} fullWidth error={!!formErrors.last_name} helperText={formErrors.last_name} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="Email Address *" type="email" value={formData.email} onChange={handleChange} fullWidth error={!!formErrors.email} helperText={formErrors.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="username" label="Username / Faculty ID *" value={formData.username} onChange={handleChange} fullWidth error={!!formErrors.username} helperText={formErrors.username} InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="password" label="Password *" type="password" value={formData.password} onChange={handleChange} fullWidth error={!!formErrors.password} helperText={formErrors.password} InputProps={{ startAdornment: <InputAdornment position="start"><KeyIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="password2" label="Confirm Password *" type="password" value={formData.password2} onChange={handleChange} fullWidth error={!!formErrors.password2} helperText={formErrors.password2} InputProps={{ startAdornment: <InputAdornment position="start"><KeyIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required={!['Admin'].includes(formData.role)} error={!!formErrors.department} disabled={formData.role === 'Admin'}>
                <InputLabel>Department *</InputLabel>
                <Select name="department" value={formData.department} label="Department *" onChange={handleChange} startAdornment={<InputAdornment position="start"><DepartmentIcon /></InputAdornment>}>
                  {departments.map((dept) => (<MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>))}
                </Select>
                {formErrors.department && <FormHelperText error>{formErrors.department}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.role}>
                <InputLabel>Role *</InputLabel>
                <Select name="role" value={formData.role} label="Role *" onChange={handleChange} startAdornment={<InputAdornment position="start"><RoleIcon /></InputAdornment>}>
                  <MenuItem value="Faculty">Faculty</MenuItem>
                  <MenuItem value="HOD">HOD</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </Select>
                {formErrors.role && <FormHelperText error>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px", borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button type="submit" form="create-user-form" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}