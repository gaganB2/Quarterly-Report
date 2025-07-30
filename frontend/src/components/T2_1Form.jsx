// src/components/T2_1Form.jsx

import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

// STEP 1: Import the new hook and constants
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Define the initial state for this specific form's fields
const initialState = {
  faculty_name: "",
  program_name: "",
  organizer: "",
  place: "",
  start_date: "", // Dates should be empty strings for the date input
  end_date: "",
  num_days: 0,
  mode: "Offline",
  registration_fee_reimbursed: false,
  special_leave_dates: "",
  certificate_link: "",
};

export default function T2_1Form({ session, year, editData, onSuccess }) {
  // STEP 2: Use the custom hook to manage all form logic
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T2.1"].endpoint, // Correct endpoint from config
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  // STEP 3: The component is now just the UI (JSX).
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Workshop Attendance (T2.1)" : "Add Workshop Attendance (T2.1)"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
        >
          {/* Quarter & Year - Handled by the hook */}
          <FormControl fullWidth size="small">
            <InputLabel>Quarter</InputLabel>
            <Select name="quarter" value={formData.quarter} label="Quarter" onChange={handleChange}>
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select name="year" value={formData.year} label="Year" onChange={handleChange}>
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Core fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} fullWidth size="small" />
          <TextField name="program_name" label="Name of FDP/STTP/Workshop" value={formData.program_name} onChange={handleChange} fullWidth size="small" />
          <TextField name="organizer" label="Organized by" value={formData.organizer} onChange={handleChange} fullWidth size="small" />
          <TextField name="place" label="Place" value={formData.place} onChange={handleChange} fullWidth size="small" />

          {/* Date fields - Note the `InputLabelProps` for date types */}
          <TextField name="start_date" label="Program Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={handleChange} fullWidth size="small" />
          <TextField name="end_date" label="Program End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={handleChange} fullWidth size="small" />
          <TextField name="num_days" label="Number of Days" type="number" value={formData.num_days} onChange={handleChange} fullWidth size="small" />

          {/* Mode & fee */}
          <FormControl fullWidth size="small">
            <InputLabel>Mode</InputLabel>
            <Select name="mode" value={formData.mode} label="Mode" onChange={handleChange}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox name="registration_fee_reimbursed" checked={formData.registration_fee_reimbursed} onChange={handleChange} />}
            label="Registration Fee Reimbursed"
            sx={{ width: "100%" }}
          />

          <TextField name="special_leave_dates" label="Special Leave Dates" value={formData.special_leave_dates} onChange={handleChange} fullWidth size="small" />
          <TextField name="certificate_link" label="Google Drive Link" value={formData.certificate_link} onChange={handleChange} fullWidth size="small" />

          {/* Submit */}
          <Box sx={{ width: "100%", textAlign: "right", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Snackbar managed by the hook */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}