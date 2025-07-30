// src/components/T5_6Form.jsx

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

// Define the initial state based on the T5_6ResearchGuidance model
const initialState = {
  faculty_name: "",
  role: "Supervisor",
  candidate_name: "",
  enrollment_number: "",
  thesis_title: "",
  registration_date: "",
  viva_voce_date: "",
  external_examiner_details: "",
  status: "Ongoing",
  research_center: "",
  conferring_university: "",
  proof_link: "",
};

export default function T5_6Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T5.6"].endpoint,
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
          {isEditMode ? "Edit Research Guidance (T5.6)" : "Add Research Guidance (T5.6)"}
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
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" />
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
              <MenuItem value="Supervisor">Supervisor</MenuItem>
              <MenuItem value="Co-Supervisor">Co-Supervisor</MenuItem>
            </Select>
          </FormControl>
          <TextField name="candidate_name" label="Name of Candidate" value={formData.candidate_name} onChange={handleChange} size="small" />
          <TextField name="enrollment_number" label="Enrollment No." value={formData.enrollment_number} onChange={handleChange} size="small" />
          <TextField name="thesis_title" label="Title of Thesis" value={formData.thesis_title} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="registration_date" label="Date of Registration" type="date" InputLabelProps={{ shrink: true }} value={formData.registration_date} onChange={handleChange} size="small" />
          <TextField name="viva_voce_date" label="Date of PhD Viva-Voce" type="date" InputLabelProps={{ shrink: true }} value={formData.viva_voce_date} onChange={handleChange} size="small" />
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
           <TextField name="research_center" label="Name of the Research Center" value={formData.research_center} onChange={handleChange} size="small" />
           <TextField name="conferring_university" label="Name of the PhD Conferring University" value={formData.conferring_university} onChange={handleChange} size="small" />
          <TextField name="external_examiner_details" label="Complete Details of External Examiner" value={formData.external_examiner_details} onChange={handleChange} size="small" multiline rows={3} sx={{ gridColumn: '1 / -1' }} />
          <TextField name="proof_link" label="Google Drive Link (Proof)" helperText="Ongoing: RDC Letter | Completed: Notification Letter" type="url" value={formData.proof_link} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />

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