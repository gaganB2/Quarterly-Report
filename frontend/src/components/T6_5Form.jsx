// src/components/T6_5Form.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Define the initial state based on the T6_5AICTEInitiative model
const initialState = {
  faculty_name: "",
  initiative_name: "",
  date: "",
  role: "Participant", // Default role
  organizing_institute: "",
  proof_link: "",
};

// Standard roles for the dropdown
const STANDARD_ROLES = ["Coordinator", "Member", "Participant"];

export default function T6_5Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    setFormData, // Get the setter from the hook
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T6.5"].endpoint,
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  // This state determines if the "Other" text field should be visible
  const [showOtherRoleField, setShowOtherRoleField] = useState(false);

  // This effect runs when the component loads or when `editData` changes.
  // It checks if the role from the database is a standard one or a custom one.
  useEffect(() => {
    if (editData?.role && !STANDARD_ROLES.includes(editData.role)) {
      setShowOtherRoleField(true);
    }
  }, [editData]);


  // Custom handler for the role dropdown
  const handleRoleChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setShowOtherRoleField(true);
      // IMPORTANT: Clear the role field so the user can type a new one
      setFormData((prev) => ({ ...prev, role: "" }));
    } else {
      setShowOtherRoleField(false);
      // If a standard role is selected, update the form data directly
      setFormData((prev) => ({ ...prev, role: value }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit AICTE Initiative (T6.5)" : "Add AICTE Initiative (T6.5)"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {/* Quarter and Year selectors */}
          <FormControl size="small">
            <InputLabel>Quarter</InputLabel>
            <Select name="quarter" value={formData.quarter} label="Quarter" onChange={handleChange}>
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select name="year" value={formData.year} label="Year" onChange={handleChange}>
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Form Fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }}/>
          <TextField name="initiative_name" label="Name of the AICTE Initiative Taken" helperText="e.g., Clean & Smart Campus, Yoga, Smart India Hackathon, etc." value={formData.initiative_name} onChange={handleChange} size="small" multiline rows={3} sx={{ gridColumn: '1 / -1' }}/>
          
          <TextField name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} size="small" />
          
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            {/* The dropdown's value is "Other" if the text field is shown, otherwise it's the actual role */}
            <Select
              value={showOtherRoleField ? 'Other' : formData.role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="Coordinator">Coordinator</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Participant">Participant</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* --- Conditionally rendered text field for "Other" role --- */}
          {showOtherRoleField && (
            <TextField
              name="role" // Name is "role", it directly controls the main role field
              label="Please specify other role"
              value={formData.role} // Its value is the main role value
              onChange={handleChange} // The generic handleChange from the hook works perfectly
              size="small"
            />
          )}

          <TextField name="organizing_institute" label="Name of the Organizing Institute" value={formData.organizing_institute} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="proof_link" label="Google Drive Link (Upload Proof)" type="url" value={formData.proof_link} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 120 }}>
              {submitting ? <CircularProgress size={20} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </motion.div>
  );
}