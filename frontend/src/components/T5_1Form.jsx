// src/components/T5_1Form.jsx

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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Define the initial state based on the T5_1PatentDetails model
const initialState = {
  faculty_name: "",
  title: "",
  internal_co_inventors: "",
  external_co_inventors: "",
  ipr_type: "Utility",
  application_number: "",
  status: "Filed",
  filled_date: "", // Use empty string for date fields
  published_granted_date: "", // Use empty string for date fields
  publication_number: "",
  technology_transfer: false,
  country: "",
  proof_link: "",
};

export default function T5_1Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T5.1"].endpoint,
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
          {isEditMode ? "Edit Patent Details (T5.1)" : "Add Patent Details (T5.1)"}
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
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="title" label="Title" value={formData.title} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }} />
          <TextField name="internal_co_inventors" label="Internal Co-Inventors" value={formData.internal_co_inventors} onChange={handleChange} size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }} />
          <TextField name="external_co_inventors" label="External Co-Inventors" value={formData.external_co_inventors} onChange={handleChange} size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }} />

          <FormControl size="small">
            <InputLabel>Type of IPR</InputLabel>
            <Select name="ipr_type" value={formData.ipr_type} label="Type of IPR" onChange={handleChange}>
              <MenuItem value="Utility">Utility</MenuItem>
              <MenuItem value="Process">Process</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Copyright">Copyright</MenuItem>
              <MenuItem value="Trademark">Trademark</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
              <MenuItem value="Filed">Filed</MenuItem>
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Granted">Granted</MenuItem>
            </Select>
          </FormControl>

          <TextField name="application_number" label="Application Number" value={formData.application_number} onChange={handleChange} size="small" />
          <TextField name="publication_number" label="Publication/Granted Number" value={formData.publication_number} onChange={handleChange} size="small" />
          <TextField name="filled_date" label="Filed Date" type="date" InputLabelProps={{ shrink: true }} value={formData.filled_date} onChange={handleChange} size="small" />
          <TextField name="published_granted_date" label="Published/Granted Date" type="date" InputLabelProps={{ shrink: true }} value={formData.published_granted_date} onChange={handleChange} size="small" />
          <TextField name="country" label="Country of Patent" value={formData.country} onChange={handleChange} size="small" />

          <FormControlLabel
            control={<Checkbox name="technology_transfer" checked={formData.technology_transfer} onChange={handleChange} />}
            label="Technology Transfer Applicable"
            sx={{ gridColumn: '1 / -1', mt: 1 }}
          />
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