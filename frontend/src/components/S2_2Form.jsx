// src/components/S2_2Form.jsx

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
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

const initialState = {
  title: "",
  author_type: "Sole",
  internal_authors: "",
  external_authors: "",
  conference_details: "",
  isbn_issn: "",
  publisher: "",
  page_no: "",
  month_year: "", 
  indexing_scopus: false,
  indexing_other: "",
  conference_status: "National",
  mode: "Offline",
  proof_link: "",
};

export default function S2_2Form({ session, year, editData, onSuccess }) {
  // --- FIX 1: Removed 'snackbar' and 'closeSnackbar' ---
  const {
    isEditMode,
    formData,
    submitting,
    handleChange,
    handleSubmit,
  } = useFormManager({
    endpoint: formConfig["S2.2"].endpoint,
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
          {isEditMode ? "Edit Conference Paper (S2.2)" : "Add Conference Paper (S2.2)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Details of the Research Paper Presented by the Students in a conference.
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
              <TextField name="title" label="Title" value={formData.title} onChange={handleChange} size="small" fullWidth />
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
              <TextField name="internal_authors" label="Internal Authors" value={formData.internal_authors} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="external_authors" label="External Authors" value={formData.external_authors} onChange={handleChange} size="small" fullWidth />
            </Grid>

            {/* Publication Details */}
            <Grid item xs={12}>
              <TextField name="conference_details" label="Details of Conference/Publication" helperText="Institution name, Place, State" value={formData.conference_details} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="isbn_issn" label="ISBN/ISSN" value={formData.isbn_issn} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="publisher" label="Publisher" value={formData.publisher} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField name="page_no" label="Page No." value={formData.page_no} onChange={handleChange} size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="month_year" label="Month & Year" placeholder="MM/YYYY" value={formData.month_year} onChange={handleChange} size="small" fullWidth />
            </Grid>

            {/* Indexing and Status */}
            <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">Indexing:</Typography>
                </Grid>
                <Grid item>
                    <FormGroup row>
                        <FormControlLabel control={<Checkbox name="indexing_scopus" checked={formData.indexing_scopus} onChange={handleChange} />} label="Scopus" />
                    </FormGroup>
                </Grid>
                <Grid item xs>
                    <TextField name="indexing_other" label="Other" value={formData.indexing_other} onChange={handleChange} size="small" fullWidth />
                </Grid>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status of Conference</InputLabel>
                <Select name="conference_status" value={formData.conference_status} label="Status of Conference" onChange={handleChange}>
                  <MenuItem value="National">National</MenuItem>
                  <MenuItem value="International">International</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Mode of Conference</InputLabel>
                <Select name="mode" value={formData.mode} label="Mode of Conference" onChange={handleChange}>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Proof Link */}
            <Grid item xs={12}>
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

      {/* --- FIX 2: Removed the entire Snackbar block --- */}
    </motion.div>
  );
}