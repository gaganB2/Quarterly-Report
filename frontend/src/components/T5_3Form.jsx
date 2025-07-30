// src/components/T5_3Form.jsx

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

// Define the initial state based on the T5_3ConsultancyProject model
const initialState = {
  internal_faculty: "",
  external_faculty: "",
  client_name: "",
  title: "",
  sanctioned_order_no: "",
  sanctioned_date: "",
  sanctioned_amount_lakhs: 0,
  amount_received_rupees: 0,
  status: "Ongoing",
  duration: "Short-Term",
  regionality: "Regional",
  proof_link: "",
};

export default function T5_3Form({ session, year, editData, onSuccess }) {
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T5.3"].endpoint,
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
          {isEditMode ? "Edit Consultancy Project (T5.3)" : "Add Consultancy Project (T5.3)"}
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
          <TextField name="title" label="Title of Consultancy" value={formData.title} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }}/>
          <TextField name="client_name" label="Name of Client" value={formData.client_name} onChange={handleChange} size="small" sx={{ gridColumn: '1 / -1' }}/>

          <TextField name="internal_faculty" label="Internal Faculty Details" value={formData.internal_faculty} onChange={handleChange} size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }} />
          <TextField name="external_faculty" label="External Faculty Details" value={formData.external_faculty} onChange={handleChange} size="small" multiline rows={2} sx={{ gridColumn: '1 / -1' }} />
          
          <TextField name="sanctioned_order_no" label="Sanctioned Order No." value={formData.sanctioned_order_no} onChange={handleChange} size="small" />
          <TextField name="sanctioned_date" label="Sanctioned Date" type="date" InputLabelProps={{ shrink: true }} value={formData.sanctioned_date} onChange={handleChange} size="small" />
          <TextField name="sanctioned_amount_lakhs" label="Sanctioned Amount (In Lakhs)" type="number" value={formData.sanctioned_amount_lakhs} onChange={handleChange} size="small" />
          <TextField name="amount_received_rupees" label="Amount Received (In Rupees)" type="number" value={formData.amount_received_rupees} onChange={handleChange} size="small" />

          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Duration</InputLabel>
            <Select name="duration" value={formData.duration} label="Duration" onChange={handleChange}>
              <MenuItem value="Short-Term">Short-Term</MenuItem>
              <MenuItem value="Medium-Term">Medium-Term</MenuItem>
              <MenuItem value="Long-Term">Long-Term</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Regionality</InputLabel>
            <Select name="regionality" value={formData.regionality} label="Regionality" onChange={handleChange}>
              <MenuItem value="Regional">Regional</MenuItem>
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