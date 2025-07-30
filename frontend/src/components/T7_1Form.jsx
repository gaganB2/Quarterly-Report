// src/components/T7_1Form.jsx

import React, { useEffect } from "react"; // 1. Import useEffect
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

// Initial state remains the same
const initialState = {
  organizer_name: "",
  event_name: "",
  event_type: "",
  start_date: "",
  end_date: "",
  num_days: 0,
  mode: "Offline",
  participants_count: 0,
  collaborator_details: "",
  report_link: "",
};

export default function T7_1Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    setFormData, // 2. Get the setFormData function from the hook
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T7.1"].endpoint,
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  // 3. Add the useEffect hook to automatically calculate the number of days
  useEffect(() => {
    // Only calculate if both dates are present and valid
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      // Ensure the end date is not before the start date
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        // Calculate the difference in days and add 1 to make it inclusive
        // (e.g., an event on the same day is 1 day long)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Update the form state with the calculated number of days
        setFormData(prev => ({ ...prev, num_days: diffDays }));
      } else {
        // If dates are invalid, reset to 0
        setFormData(prev => ({ ...prev, num_days: 0 }));
      }
    }
  }, [formData.start_date, formData.end_date, setFormData]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Organized Program (T7.1)" : "Add Organized Program (T7.1)"}
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
          {/* ... Quarter and Year selectors ... */}
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
          <TextField name="organizer_name" label="Name of the Organizer" helperText="Clubs/Professional Bodies, etc" value={formData.organizer_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="event_name" label="Name of the Event/Competition" value={formData.event_name} onChange={handleChange} size="small" />
          <TextField name="event_type" label="Type of Event/Competition" value={formData.event_type} onChange={handleChange} size="small" />
          <TextField name="start_date" label="Program Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={handleChange} size="small" />
          <TextField name="end_date" label="Program End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={handleChange} size="small" />
          
          {/* 4. The "Number of Days" field is now disabled and shows the calculation */}
          <TextField
            name="num_days"
            label="Number of Days (Calculated)"
            type="number"
            value={formData.num_days}
            size="small"
            disabled // This prevents manual entry
          />
          
          <FormControl size="small">
            <InputLabel>Mode</InputLabel>
            <Select name="mode" value={formData.mode} label="Mode" onChange={handleChange}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <TextField name="participants_count" label="Number of Participants" type="number" value={formData.participants_count} onChange={handleChange} size="small" />
          <TextField name="collaborator_details" label="Collaborator (if any)" helperText="Include complete contact details" value={formData.collaborator_details} onChange={handleChange} size="small" multiline rows={3} sx={{ gridColumn: '1 / -1' }}/>
          <TextField name="report_link" label="Google Drive Link (Upload Report)" type="url" value={formData.report_link} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />

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