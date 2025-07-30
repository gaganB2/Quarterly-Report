// src/components/T4_2Form.jsx

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

// Define the initial state based on the T4_2ReviewerDetails model
const initialState = {
  faculty_name: "",
  publication_type: "Journal",
  title: "",
  indexing: "SCI",
  issn_isbn: "",
  publisher: "",
  type: "National",
  proof_link: "",
};

export default function T4_2Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T4.2"].endpoint,
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
          {isEditMode ? "Edit Reviewer Details (T4.2)" : "Add Reviewer Details (T4.2)"}
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

          {/* All other form fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="title" label="Title of Journal/Conference/Book" value={formData.title} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />

          <FormControl size="small">
            <InputLabel>Publication Type</InputLabel>
            <Select name="publication_type" value={formData.publication_type} label="Publication Type" onChange={handleChange}>
              <MenuItem value="Journal">Journal</MenuItem>
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Book">Book</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Indexing</InputLabel>
            <Select name="indexing" value={formData.indexing} label="Indexing" onChange={handleChange}>
              <MenuItem value="SCI">SCI</MenuItem>
              <MenuItem value="Scopus">Scopus</MenuItem>
              <MenuItem value="UGC CARE">UGC CARE</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
          <TextField name="issn_isbn" label="ISSN/ISBN No." value={formData.issn_isbn} onChange={handleChange} size="small" />
          <TextField name="publisher" label="Publisher" value={formData.publisher} onChange={handleChange} size="small" />
          <FormControl size="small">
            <InputLabel>Type</InputLabel>
            <Select name="type" value={formData.type} label="Type" onChange={handleChange}>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
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