// src/components/S2_1Form.jsx

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
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// FIX: Renamed 'publication_month_year' to 'month_year' to match the backend model.
const initialState = {
  title: "",
  author_type: "Sole",
  internal_authors: "",
  external_authors: "",
  journal_name: "",
  volume: "",
  issue: "",
  page_no: "",
  month_year: "", // Corrected field name
  issn_number: "",
  impact_factor: "",
  publisher: "",
  indexing_wos: false,
  indexing_scopus: false,
  indexing_ugc: false,
  indexing_other: "",
  doi: "",
  proof_link: "",
};

export default function S2_1Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["S2.1"].endpoint,
    initialState,
    editData,
    onSuccess,
    session,
    year,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Student Article (S2.1)" : "Add Student Article (S2.1)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Details of the Published Research Articles/Papers in Journals/Periodicals by the students.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <Grid container spacing={2}>
            {/* Quarter and Year */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Quarter</InputLabel>
                <Select name="quarter" value={formData.quarter} label="Quarter" onChange={handleChange}>
                  {QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select name="year" value={formData.year} label="Year" onChange={handleChange}>
                  {YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>

            {/* Main Details */}
            <Grid item xs={12}>
              <TextField name="title" label="Title of Article" value={formData.title} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Author Type</InputLabel>
                <Select name="author_type" value={formData.author_type} label="Author Type" onChange={handleChange}>
                  <MenuItem value="Sole">Sole</MenuItem>
                  <MenuItem value="First">First</MenuItem>
                  <MenuItem value="Corresponding">Corresponding</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="internal_authors" label="Internal Authors (Students/Faculty)" value={formData.internal_authors} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="external_authors" label="External Authors" value={formData.external_authors} onChange={handleChange} size="small" fullWidth />
            </Grid>

            {/* Journal Details */}
            <Grid item xs={12} sm={8}>
              <TextField name="journal_name" label="Journal Name" value={formData.journal_name} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="publisher" label="Publisher" value={formData.publisher} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="volume" label="Volume" value={formData.volume} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="issue" label="Issue" value={formData.issue} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="page_no" label="Page No." value={formData.page_no} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              {/* FIX: The 'name' prop is now correctly set to 'month_year' */}
              <TextField name="month_year" label="Month & Year" placeholder="MM/YYYY" value={formData.month_year} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="issn_number" label="ISSN Number" value={formData.issn_number} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="impact_factor" label="Impact Factor" value={formData.impact_factor} onChange={handleChange} size="small" fullWidth />
            </Grid>

            {/* Indexing */}
            <Grid item xs={12} container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="subtitle2" color="text.secondary">Indexing:</Typography>
              </Grid>
              <Grid item>
                <FormGroup row>
                  <FormControlLabel control={<Checkbox name="indexing_wos" checked={formData.indexing_wos} onChange={handleChange} />} label="WOS" />
                  <FormControlLabel control={<Checkbox name="indexing_scopus" checked={formData.indexing_scopus} onChange={handleChange} />} label="Scopus" />
                  <FormControlLabel control={<Checkbox name="indexing_ugc" checked={formData.indexing_ugc} onChange={handleChange} />} label="UGC Care" />
                </FormGroup>
              </Grid>
              <Grid item xs>
                <TextField name="indexing_other" label="Other" value={formData.indexing_other} onChange={handleChange} size="small" fullWidth />
              </Grid>
            </Grid>

            {/* Links */}
            <Grid item xs={12} sm={6}>
              <TextField name="doi" label="DOI" value={formData.doi} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="proof_link" label="Google Drive Link (Upload Proof)" type="url" value={formData.proof_link} onChange={handleChange} size="small" fullWidth />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
