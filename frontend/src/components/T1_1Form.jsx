// src/components/T1_1Form.jsx

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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import apiClient from "../api/axios";

// Reuse the full-quarter labels
const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (July – September)" },
  { value: "Q2", label: "Q2 (October – December)" },
  { value: "Q3", label: "Q3 (January – March)" },
  { value: "Q4", label: "Q4 (April – June)" },
];

// Span academic years from 2000–2001 to 2099–2100
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const start = 2000 + i;
  return { value: start, label: `${start} – ${start + 1}` };
});

export default function T1_1Form({ session, year, editData, onSuccess }) {
  const isEditMode = Boolean(editData?.id);

  // Local quarter/year state
  const [q, setQ] = useState(session || QUARTER_OPTIONS[0].value);
  const [y, setY] = useState(year || YEAR_OPTIONS[0].value);

  // All other form fields
  const [formData, setFormData] = useState({
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
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pre-fill on edit
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        faculty_name: editData.faculty_name || "",
        title: editData.title || "",
        author_type: editData.author_type || "Sole",
        internal_authors: editData.internal_authors || "",
        external_authors: editData.external_authors || "",
        journal_name: editData.journal_name || "",
        volume: editData.volume || "",
        issue: editData.issue || "",
        page_no: editData.page_no || "",
        publication_month_year: editData.publication_month_year || "",
        issn_number: editData.issn_number || "",
        impact_factor: editData.impact_factor || "",
        publisher: editData.publisher || "",
        indexing_wos: editData.indexing_wos || false,
        indexing_scopus: editData.indexing_scopus || false,
        indexing_ugc: editData.indexing_ugc || false,
        indexing_other: editData.indexing_other || "",
        doi: editData.doi || "",
        document_link: editData.document_link || "",
        google_drive_link: editData.google_drive_link || "",
        department: editData.department || "",
      });
      setQ(editData.quarter);
      setY(editData.year);
    }
  }, [editData, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  const payload = { ...formData, quarter: q, year: y };

  try {
    if (isEditMode) {
      await apiClient.put(`/api/faculty/t1research/${editData.id}/`, payload);
      setSnackbar({
        open: true,
        message: "Updated successfully",
        severity: "success",
      });
    } else {
      await apiClient.post("/api/faculty/t1research/", payload);
      setSnackbar({
        open: true,
        message: "Submitted successfully",
        severity: "success",
      });
    }
    onSuccess();

  } catch (err) {
    // 1. Log raw validation errors
    console.error("T1.1 submit error response.data:", err.response?.data);

    // 2. Build a user-friendly error message
    let msg = "Submission failed";
    const data = err.response?.data;
    if (data) {
      if (Array.isArray(data)) {
        msg = data.join(" ");
      } else if (typeof data === "object") {
        msg = Object.entries(data)
          .map(([field, errors]) => {
            const text = Array.isArray(errors) ? errors.join(" ") : errors;
            return `${field}: ${text}`;
          })
          .join(" ; ");
      }
    }

    setSnackbar({
      open: true,
      message: msg,
      severity: "error",
    });

  } finally {
    setSubmitting(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Research Article" : "Add Research Article"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mt: 2,
          }}
        >
          {/* Session & Year */}
          <FormControl fullWidth size="small">
            <InputLabel>Quarter</InputLabel>
            <Select
              value={q}
              label="Quarter"
              onChange={(e) => setQ(e.target.value)}
            >
              {QUARTER_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={y}
              label="Year"
              onChange={(e) => setY(e.target.value)}
            >
              {YEAR_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Faculty Name */}
          <TextField
            name="faculty_name"
            label="Name of Faculty"
            value={formData.faculty_name}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Title */}
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Author Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Author Type</InputLabel>
            <Select
              name="author_type"
              value={formData.author_type}
              label="Author Type"
              onChange={handleChange}
            >
              <MenuItem value="Sole">Sole</MenuItem>
              <MenuItem value="First">First</MenuItem>
              <MenuItem value="Corresponding">Corresponding</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Internal & External Authors */}
          <TextField
            name="internal_authors"
            label="Internal Authors"
            value={formData.internal_authors}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="external_authors"
            label="External Authors"
            value={formData.external_authors}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Publication Details */}
          <TextField
            name="journal_name"
            label="Journal Name"
            value={formData.journal_name}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="volume"
            label="Volume"
            value={formData.volume}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="issue"
            label="Issue"
            value={formData.issue}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="page_no"
            label="Page No"
            value={formData.page_no}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="publication_month_year"
            label="Month & Year"
            placeholder="MM/YYYY"
            value={formData.publication_month_year}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="issn_number"
            label="ISSN Number"
            value={formData.issn_number}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="impact_factor"
            label="Impact Factor"
            value={formData.impact_factor}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />
          <TextField
            name="publisher"
            label="Publisher"
            value={formData.publisher}
            onChange={handleChange}
            size="small"
            sx={{ flex: "1 1 45%" }}
          />

          {/* Indexing Checkboxes */}
          <FormGroup row sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.indexing_wos}
                  onChange={handleChange}
                  name="indexing_wos"
                />
              }
              label="WOS"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.indexing_scopus}
                  onChange={handleChange}
                  name="indexing_scopus"
                />
              }
              label="Scopus"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.indexing_ugc}
                  onChange={handleChange}
                  name="indexing_ugc"
                />
              }
              label="UGC Care"
            />
          </FormGroup>
          <TextField
            name="indexing_other"
            label="Other Indexing"
            value={formData.indexing_other}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />

          {/* DOI & Links */}
          <TextField
            name="doi"
            label="DOI"
            value={formData.doi}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            name="document_link"
            label="Document Link"
            value={formData.document_link}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="google_drive_link"
            label="Google Drive Link"
            value={formData.google_drive_link}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Department */}
          <TextField
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Submit */}
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? (
                <CircularProgress size={20} />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
