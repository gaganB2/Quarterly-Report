// src/components/T2_2Form.jsx

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
  role: "Coordinator",
  activity_type: "",
  program_name: "",
  organized_by_dept: "",
  place: "",
  start_date: "",
  end_date: "",
  num_days: 0,
  mode: "Offline",
  num_participants: 0,
  collaborator: "",
  report_link: "",
};

export default function T2_2Form({ session, year, editData, onSuccess }) {
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
    endpoint: formConfig["T2.2"].endpoint, // Correct endpoint from config
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  // STEP 3: The component is now just the UI (JSX).
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? "Edit Organized Program (T2.2)" : "Add Organized Program (T2.2)"}
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
          {/* Session Controls - Handled by the hook */}
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

          {/* Core Fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" />
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
              <MenuItem value="Coordinator">Coordinator</MenuItem>
              <MenuItem value="Co-Coordinator">Co-Coordinator</MenuItem>
            </Select>
          </FormControl>
          <TextField name="activity_type" label="Type of Activity" value={formData.activity_type} onChange={handleChange} size="small" />
          <TextField name="program_name" label="Program Name" value={formData.program_name} onChange={handleChange} size="small" />
          <TextField name="organized_by_dept" label="Organized By (Dept)" value={formData.organized_by_dept} onChange={handleChange} size="small" />
          <TextField name="place" label="Place" value={formData.place} onChange={handleChange} size="small" />

          {/* Dates */}
          <TextField name="start_date" label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={handleChange} size="small" />
          <TextField name="end_date" label="End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={handleChange} size="small" />
          <TextField name="num_days" label="Number of Days" type="number" value={formData.num_days} onChange={handleChange} size="small" inputProps={{ min: 0 }} />
          
          <FormControl size="small">
            <InputLabel>Mode</InputLabel>
            <Select name="mode" value={formData.mode} label="Mode" onChange={handleChange}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <TextField name="num_participants" label="Participants" type="number" value={formData.num_participants} onChange={handleChange} size="small" inputProps={{ min: 0 }} />
          <TextField name="collaborator" label="Collaborator" value={formData.collaborator} onChange={handleChange} size="small" />
          
          <TextField
            name="report_link"
            label="Report Link"
            type="url"
            placeholder="https://drive.google.com/..."
            helperText="Enter full URL to your Google Drive report"
            value={formData.report_link}
            onChange={handleChange}
            size="small"
            required
            sx={{ gridColumn: '1 / -1' }} // Span full width
          />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 120 }}>
              {submitting ? <CircularProgress size={20} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Feedback Snackbar - Managed by the hook */}
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