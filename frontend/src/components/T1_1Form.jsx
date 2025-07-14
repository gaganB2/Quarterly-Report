// src/components/T1_1Form.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
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

const T1_1Form = ({ session, year, onSuccess, editData }) => {
  const isEditMode = Boolean(editData?.id);

  const [formData, setFormData] = useState({
    title: "",
    journal_name: "",
    publication_date: "",
    issn_number: "",
    indexing_wos: false,
    indexing_scopus: false,
    indexing_ugc: false,
    indexing_other: "",
    impact_factor: "",
    internal_authors: "",
    external_authors: "",
    document_link: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Prefill for edit
  useEffect(() => {
    if (isEditMode) {
      const { id, created_at, updated_at, user, ...rest } = editData;
      setFormData(rest);
    }
  }, [editData]);

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

    const payload = {
      ...formData,
      quarter: session,
      year: year,
    };

    try {
      if (isEditMode) {
        await apiClient.put(`/api/faculty/t1research/${editData.id}/`, payload);
        setSnackbar({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await apiClient.post("api/faculty/t1research/", payload);
        setSnackbar({ open: true, message: "Submitted successfully", severity: "success" });
      }

      setFormData({
        title: "",
        journal_name: "",
        publication_date: "",
        issn_number: "",
        indexing_wos: false,
        indexing_scopus: false,
        indexing_ugc: false,
        indexing_other: "",
        impact_factor: "",
        internal_authors: "",
        external_authors: "",
        document_link: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Submission failed", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper elevation={2} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {isEditMode ? "Edit Submission" : "Add Research Article (T1.1)"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="title" label="Title" required
                value={formData.title} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="journal_name" label="Journal Name"
                value={formData.journal_name} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="publication_date" type="date" label="Publication Date"
                value={formData.publication_date} onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="issn_number" label="ISSN Number"
                value={formData.issn_number} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="impact_factor" label="Impact Factor"
                value={formData.impact_factor} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="internal_authors" label="Internal Authors"
                value={formData.internal_authors} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="external_authors" label="External Authors"
                value={formData.external_authors} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormLabel>Indexing</FormLabel>
                <FormGroup row>
                  {[
                    { name: "indexing_wos", label: "WOS" },
                    { name: "indexing_scopus", label: "Scopus" },
                    { name: "indexing_ugc", label: "UGC" },
                  ].map((i) => (
                    <FormControlLabel
                      key={i.name}
                      control={
                        <Checkbox checked={formData[i.name]} onChange={handleChange} name={i.name} />
                      }
                      label={i.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth name="indexing_other" label="Other Indexing"
                value={formData.indexing_other} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth name="document_link" label="Document Link"
                value={formData.document_link} onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={20} /> : isEditMode ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default T1_1Form;
