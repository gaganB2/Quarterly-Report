// src/components/T4_3Form.jsx

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

// Define the initial state based on the T4_3CommitteeMembership model
const initialState = {
  faculty_name: "",
  body_details: "",
  responsibility: "Chairperson",
  level: "University",
  other_details: "",
  proof_link: "",
};

export default function T4_3Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T4.3"].endpoint,
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
          {isEditMode ? "Edit Committee Membership (T4.3)" : "Add Committee Membership (T4.3)"}
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
          <TextField name="body_details" label="Details of the body/committee" value={formData.body_details} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }}/>

          <FormControl size="small">
            <InputLabel>Responsibility</InputLabel>
            <Select name="responsibility" value={formData.responsibility} label="Responsibility" onChange={handleChange}>
              <MenuItem value="Chairperson">Chairperson</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Level</InputLabel>
            <Select name="level" value={formData.level} label="Level" onChange={handleChange}>
              <MenuItem value="University">University</MenuItem>
              <MenuItem value="State">State</MenuItem>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          
          <TextField name="other_details" label="Any other details" value={formData.other_details} onChange={handleChange} size="small" multiline rows={3} sx={{ gridColumn: '1 / -1' }} />
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