// src/components/T1_1Form.jsx

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
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  title: "",
  author_type: "Sole",
  internal_authors: "",
  external_authors: "",
  journal_name: "",
  volume: "",
  issue: "",
  page_no: "",
  publication_month_year: "",
  issn_number: "",
  impact_factor: "",
  publisher: "",
  indexing_wos: false,
  indexing_scopus: false,
  indexing_ugc: false,
  indexing_other: "",
  doi: "",
  document_link: "",
  google_drive_link: "",
  department: "",
};

export default function T1_1Form({ session, year, editData, onSuccess }) {
  // STEP 2: Use the custom hook to manage all form logic
  const {
    isEditMode,
    formData,
    setFormData, // Use the setter for dedicated quarter/year controls
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T1.1"].endpoint,
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  // STEP 3: The component is now just the UI (JSX). All logic is in the hook.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Research Article (T1.1)" : "Add Research Article (T1.1)"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
        >
          {/* Session & Year */}
          <FormControl fullWidth size="small">
            <InputLabel>Quarter</InputLabel>
            <Select
              name="quarter"
              value={formData.quarter}
              label="Quarter"
              onChange={handleChange} // The hook's handleChange works here too
            >
              {QUARTER_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={formData.year}
              label="Year"
              onChange={handleChange}
            >
              {YEAR_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* All other form fields remain the same, using `formData` and `handleChange` */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" fullWidth />
          <TextField name="title" label="Title" value={formData.title} onChange={handleChange} size="small" fullWidth />

          <FormControl fullWidth size="small">
            <InputLabel>Author Type</InputLabel>
            <Select name="author_type" value={formData.author_type} label="Author Type" onChange={handleChange}>
              <MenuItem value="Sole">Sole</MenuItem>
              <MenuItem value="First">First</MenuItem>
              <MenuItem value="Corresponding">Corresponding</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField name="internal_authors" label="Internal Authors" value={formData.internal_authors} onChange={handleChange} size="small" fullWidth />
          <TextField name="external_authors" label="External Authors" value={formData.external_authors} onChange={handleChange} size="small" fullWidth />
          <TextField name="journal_name" label="Journal Name" value={formData.journal_name} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="volume" label="Volume" value={formData.volume} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="issue" label="Issue" value={formData.issue} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="page_no" label="Page No" value={formData.page_no} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="publication_month_year" label="Month & Year" placeholder="MM/YYYY" value={formData.publication_month_year} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="issn_number" label="ISSN Number" value={formData.issn_number} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="impact_factor" label="Impact Factor" value={formData.impact_factor} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />
          <TextField name="publisher" label="Publisher" value={formData.publisher} onChange={handleChange} size="small" sx={{ flex: "1 1 45%" }} />

          <FormGroup row sx={{ mt: 2 }}>
            <FormControlLabel control={<Checkbox checked={formData.indexing_wos} onChange={handleChange} name="indexing_wos" />} label="WOS" />
            <FormControlLabel control={<Checkbox checked={formData.indexing_scopus} onChange={handleChange} name="indexing_scopus" />} label="Scopus" />
            <FormControlLabel control={<Checkbox checked={formData.indexing_ugc} onChange={handleChange} name="indexing_ugc" />} label="UGC Care" />
          </FormGroup>
          <TextField name="indexing_other" label="Other Indexing" value={formData.indexing_other} onChange={handleChange} size="small" fullWidth sx={{ mt: 1 }} />

          <TextField name="doi" label="DOI" value={formData.doi} onChange={handleChange} size="small" fullWidth sx={{ mt: 2 }} />
          <TextField name="document_link" label="Document Link" value={formData.document_link} onChange={handleChange} size="small" fullWidth />
          <TextField name="google_drive_link" label="Google Drive Link" value={formData.google_drive_link} onChange={handleChange} size="small" fullWidth />
          <TextField name="department" label="Department" value={formData.department} onChange={handleChange} size="small" fullWidth />

          <Box display="flex" justifyContent="flex-end" sx={{ mt: 3, width: '100%' }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={20} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* The snackbar now uses the state from the hook */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}