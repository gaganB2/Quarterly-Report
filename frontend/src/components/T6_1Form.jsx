// src/components/T6_1Form.jsx

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
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Define the initial state based on the T6_1CertificationCourse model
const initialState = {
  faculty_name: "",
  certification_course: "",
  course_name: "",
  category: "",
  duration: "",
  credit_points: "",
  certification_type: "Passed",
  certificate_link: "",
};

export default function T6_1Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T6.1"].endpoint,
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Certification Course (T6.1)" : "Add Certification Course (T6.1)"}
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
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="certification_course" label="Name of the Certification Course" value={formData.certification_course} onChange={handleChange} size="small" />
          <TextField name="course_name" label="Course Name" value={formData.course_name} onChange={handleChange} size="small" />
          <TextField name="category" label="Category of the Course" value={formData.category} onChange={handleChange} size="small" />
          <TextField name="duration" label="Duration of the Course" value={formData.duration} onChange={handleChange} size="small" />
          <TextField name="credit_points" label="Credit Points Earned" value={formData.credit_points} onChange={handleChange} size="small" />

          <FormControl size="small">
            <InputLabel>Certification Type</InputLabel>
            <Select name="certification_type" value={formData.certification_type} label="Certification Type" onChange={handleChange}>
              <MenuItem value="Elite-Gold">Elite-Gold</MenuItem>
              <MenuItem value="Elite-Silver">Elite-Silver</MenuItem>
              <MenuItem value="Passed">Passed</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField name="certificate_link" label="Google Drive Link (Upload Certificate)" type="url" value={formData.certificate_link} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }}/>

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