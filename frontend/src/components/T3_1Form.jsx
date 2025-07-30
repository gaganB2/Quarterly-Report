// src/components/T3_1Form.jsx

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
  book_title: "",
  author_type: "Sole",
  publisher_details: "",
  isbn_number: "",
  indexing: "",
  publication_year: new Date().getFullYear(),
  print_mode: "Hardcopy",
  book_type: "National",
  proof_link: "",
};

export default function T3_1Form({ session, year, editData, onSuccess }) {
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
    endpoint: formConfig["T3.1"].endpoint, // Correct endpoint from config
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
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Book Publication (T3.1)" : "Add Book Publication (T3.1)"}
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
          {/* Quarter & Year */}
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
          <TextField name="book_title" label="Book Title" value={formData.book_title} onChange={handleChange} size="small" />
          <FormControl size="small">
            <InputLabel>Author Type</InputLabel>
            <Select name="author_type" value={formData.author_type} label="Author Type" onChange={handleChange}>
              <MenuItem value="Sole">Sole</MenuItem>
              <MenuItem value="Co-Author">Co-Author</MenuItem>
            </Select>
          </FormControl>
          <TextField name="publisher_details" label="Publisher Details" value={formData.publisher_details} onChange={handleChange} size="small" />
          <TextField name="isbn_number" label="ISSN/ISBN" value={formData.isbn_number} onChange={handleChange} size="small" />
          <TextField name="indexing" label="Indexing" value={formData.indexing} onChange={handleChange} size="small" />
          <TextField name="publication_year" label="Year of Publication" type="number" value={formData.publication_year} onChange={handleChange} size="small" inputProps={{ min: 1900, max: new Date().getFullYear() }} />
          <FormControl size="small">
            <InputLabel>Print Mode</InputLabel>
            <Select name="print_mode" value={formData.print_mode} label="Print Mode" onChange={handleChange}>
              <MenuItem value="Hardcopy">Hardcopy</MenuItem>
              <MenuItem value="E-print">E-print</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Book Type</InputLabel>
            <Select name="book_type" value={formData.book_type} label="Book Type" onChange={handleChange}>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="proof_link"
            label="Proof Link"
            type="url"
            placeholder="https://..."
            helperText="Full URL to proof document"
            value={formData.proof_link}
            onChange={handleChange}
            size="small"
            sx={{ gridColumn: '1 / -1' }}
          />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 120 }}>
              {submitting ? <CircularProgress size={20} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Snackbar */}
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