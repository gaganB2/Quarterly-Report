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
  FormLabel,
  Checkbox,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import apiClient from "../api/axios";

// Quarter options
const SESSION_OPTIONS = [
  { label: "Q1: July – Sep", value: "Q1" },
  { label: "Q2: Oct – Dec", value: "Q2" },
  { label: "Q3: Jan – Mar", value: "Q3" },
  { label: "Q4: Apr – Jun", value: "Q4" },
];

// Academic-year options
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const y = new Date().getFullYear() - 2 + i;
  return { label: `${y} – ${y + 1}`, value: y };
});

export default function T1_1Form({ session, year, editData, onSuccess }) {
  const isEditMode = Boolean(editData?.id);

  // Local quarter/year selectors
  const [q, setQ] = useState(session);
  const [y, setY] = useState(year);

  // All other form fields
  const [formData, setFormData] = useState({
    title: "",
    journal_name: "",
    publication_date: "",
    issn_number: "",
    impact_factor: "",
    internal_authors: "",
    external_authors: "",
    indexing_wos: false,
    indexing_scopus: false,
    indexing_ugc: false,
    indexing_other: "",
    document_link: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Populate formData (and q/y) when editData arrives
  useEffect(() => {
    if (isEditMode && editData) {
      const { id, created_at, updated_at, user, ...rest } = editData;
      setFormData(rest);
      setQ(editData.quarter);
      setY(editData.year);
    }
  }, [editData, isEditMode]);

  // Handle text inputs & checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      quarter: q,
      year: y,
    };

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
      setSnackbar({
        open: true,
        message: "Something went wrong",
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
      <Paper sx={{ p: 3 }}>
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
          {/* 1. Header */}
          <Typography variant="h6" gutterBottom>
            {isEditMode
              ? "Edit T1.1: Published Research Article"
              : "Add T1.1: Published Research Article"}
          </Typography>

          {/* 2. Session & Year selectors */}
          <Box display="flex" gap={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Session</InputLabel>
              <Select
                value={q}
                label="Session"
                onChange={(e) => setQ(e.target.value)}
              >
                {SESSION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
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
                {YEAR_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 3. Core Inputs */}
          <TextField
            name="faculty_name"
            label="Name of Faculty"
            value={formData.faculty_name}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* 4. Author type */}
          <FormControl size="small" fullWidth>
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

          {/* 5. Publication details group */}
          <Box display="flex" flexWrap="wrap" gap={2}>
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
          </Box>

          {/* 6. Indexing checkboxes */}
          <FormGroup row sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.indexing_wos}
                  onChange={handleChange}
                  name="indexing_wos"
                />
              }
              label="WOS (ESCI, SCIE…)"
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
              label="UGC Care 1"
            />
          </FormGroup>
          <TextField
            name="indexing_other"
            label="Other (Referred Journal)"
            value={formData.indexing_other}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />

          {/* 7. Links/DOI/Department */}
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
            label="Google Drive Link (Upload Proof)"
            value={formData.google_drive_link}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          />

          {/* 8. Submit button */}
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting
                ? "Submitting…"
                : isEditMode
                ? "Update Record"
                : "Submit Record"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
