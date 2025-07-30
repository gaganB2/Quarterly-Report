// src/components/T4_1Form.jsx

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

// Import the hook and constants we created
import { useFormManager } from "../hooks/useFormManager";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Define the initial state based on the T4_1EditorialBoard model
const initialState = {
  faculty_name: "",
  title: "",
  role: "Editor",
  publisher: "",
  issn_isbn: "",
  indexing: "WoS",
  // No quarter/year here, they are managed by the hook's own state
  type: "National",
  proof_link: "",
};

export default function T4_1Form({ session, year, editData, onSuccess }) {
  // The useFormManager hook handles all the logic
  const {
    isEditMode,
    formData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  } = useFormManager({
    endpoint: formConfig["T4.1"].endpoint,
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
          {isEditMode
            ? "Edit Editorial Board (T4.1)"
            : "Add Editorial Board (T4.1)"}
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
          <FormControl size="small" fullWidth>
            <InputLabel>Quarter</InputLabel>
            <Select
              name="quarter"
              value={formData.quarter}
              label="Quarter"
              onChange={handleChange}
            >
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={formData.year}
              label="Year"
              onChange={handleChange}
            >
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* All other form fields from the model */}
          <TextField
            name="faculty_name"
            label="Name of Faculty"
            value={formData.faculty_name}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ gridColumn: "1 / -1" }} // Span full width
          />
          <TextField
            name="title"
            label="Title of the Book or Journal"
            value={formData.title}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Co-editor">Co-editor</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="publisher"
            label="Publisher with complete address"
            value={formData.publisher}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="issn_isbn"
            label="ISSN/ISBN No."
            value={formData.issn_isbn}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Indexing</InputLabel>
            <Select
              name="indexing"
              value={formData.indexing}
              label="Indexing"
              onChange={handleChange}
            >
              <MenuItem value="WoS">WoS</MenuItem>
              <MenuItem value="Scopus">Scopus</MenuItem>
              <MenuItem value="UGC CARE">UGC CARE</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Type of Book/Journal</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Type of Book/Journal"
              onChange={handleChange}
            >
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="proof_link"
            label="Google Drive Link (Upload Proof)"
            type="url"
            value={formData.proof_link}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
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

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}