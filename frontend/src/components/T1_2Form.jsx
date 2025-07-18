// src/components/T1_2Form.jsx
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
// import apiClient from "../components/api/axios";
import apiClient from "../api/axios";

// Quarter options
const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (July – September)" },
  { value: "Q2", label: "Q2 (October – December)" },
  { value: "Q3", label: "Q3 (January – March)" },
  { value: "Q4", label: "Q4 (April – June)" },
];

// Year options (last 6 years)
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const y = new Date().getFullYear() - 2 + i;
  return { label: `${y} – ${y + 1}`, value: y };
});

export default function T1_2Form({ session, year, editData, onSuccess }) {
  const isEditMode = Boolean(editData?.id);
  const [q, setQ] = useState(session);
  const [y, setY] = useState(year);

  const [formData, setFormData] = useState({
    faculty_name: "",
    title: "",
    author_type: "Sole",
    internal_authors: "",
    external_authors: "",
    conference_details: "",
    isbn_issn: "",
    publisher: "",
    page_no: "",
    publication_month_year: "",
    indexing_scopus: false,
    indexing_other: "",
    conference_status: "National",
    conference_mode: "Offline",
    registration_fee_reimbursed: false,
    special_leave_dates: "",
    certificate_link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (isEditMode && editData) {
      const { id, user, department, created_at, updated_at, quarter, year, ...rest } = editData;
      setFormData(rest);
      setQ(quarter);
      setY(year);
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
        await apiClient.put(`/api/faculty/t1_2research/${editData.id}/`, payload);
        setSnackbar({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await apiClient.post("/api/faculty/t1_2research/", payload);
        setSnackbar({ open: true, message: "Submitted successfully", severity: "success" });
      }
      onSuccess();
    } catch (error) {
      setSnackbar({ open: true, message: error?.response?.data || "Something went wrong", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          {isEditMode ? "Edit Conference Paper (T1.2)" : "Add Conference Paper (T1.2)"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          {/* Quarter & Year */}
          <FormControl fullWidth size="small">
            <InputLabel>Quarter</InputLabel>
            <Select value={q} label="Quarter" onChange={(e) => setQ(e.target.value)}>
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select value={y} label="Year" onChange={(e) => setY(e.target.value)}>
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Core Fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} fullWidth size="small" />
          <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth size="small" />

          {/* Author Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Author Type</InputLabel>
            <Select name="author_type" value={formData.author_type} label="Author Type" onChange={handleChange}>
              <MenuItem value="Sole">Sole</MenuItem>
              <MenuItem value="First">First</MenuItem>
              <MenuItem value="Corresponding">Corresponding</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField name="internal_authors" label="Internal Authors" value={formData.internal_authors} onChange={handleChange} fullWidth size="small" />
          <TextField name="external_authors" label="External Authors" value={formData.external_authors} onChange={handleChange} fullWidth size="small" />

          {/* Conference Details */}
          <TextField name="conference_details" label="Conference / Publication Details" value={formData.conference_details} onChange={handleChange} fullWidth size="small" />
          <TextField name="isbn_issn" label="ISBN/ISSN" value={formData.isbn_issn} onChange={handleChange} fullWidth size="small" />
          <TextField name="publisher" label="Publisher" value={formData.publisher} onChange={handleChange} fullWidth size="small" />
          <TextField name="page_no" label="Page No" value={formData.page_no} onChange={handleChange} fullWidth size="small" />
          <TextField name="publication_month_year" label="Month & Year" placeholder="MM/YYYY" value={formData.publication_month_year} onChange={handleChange} fullWidth size="small" />

          {/* Indexing */}
          <FormGroup row>
            <FormControlLabel control={<Checkbox name="indexing_scopus" checked={formData.indexing_scopus} onChange={handleChange} />} label="Scopus" />
          </FormGroup>
          <TextField name="indexing_other" label="Other Indexing" value={formData.indexing_other} onChange={handleChange} fullWidth size="small" />

          {/* Conference Metadata */}
          <FormControl fullWidth size="small">
            <InputLabel>Conference Status</InputLabel>
            <Select name="conference_status" value={formData.conference_status} label="Conference Status" onChange={handleChange}>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Conference Mode</InputLabel>
            <Select name="conference_mode" value={formData.conference_mode} label="Conference Mode" onChange={handleChange}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <FormGroup row>
            <FormControlLabel control={<Checkbox name="registration_fee_reimbursed" checked={formData.registration_fee_reimbursed} onChange={handleChange} />} label="Registration Fee Reimbursed" />
          </FormGroup>
          <TextField name="special_leave_dates" label="Special Leave Dates" value={formData.special_leave_dates} onChange={handleChange} fullWidth size="small" />
          <TextField name="certificate_link" label="Google Drive Link" value={formData.certificate_link} onChange={handleChange} fullWidth size="small" />

          {/* Submit Button */}
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
