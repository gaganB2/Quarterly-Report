// src/components/T2_2Form.jsx
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
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import apiClient from "../api/axios";

const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (July – September)" },
  { value: "Q2", label: "Q2 (October – December)" },
  { value: "Q3", label: "Q3 (January – March)" },
  { value: "Q4", label: "Q4 (April – June)" },
];

// Show every academic cycle from 2000–2001 up to 2099–2100
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const start = 2000 + i;
  return {
    value: start,
    label: `${start} – ${start + 1}`
  };
});


export default function T2_2Form({ session, year, editData, onSuccess }) {
  const isEdit = Boolean(editData?.id);
  const [quarter, setQuarter] = useState(session);
  const [acadYear, setAcadYear] = useState(year);
  const [formData, setFormData] = useState({
    faculty_name: "",
    role: "Coordinator",
    activity_type: "",
    program_name: "",
    organized_by_dept: "",
    place: "",
    start_date: "",
    end_date: "",
    num_days: 0,
    mode: "Offline",
    num_participants: 0,
    collaborator: "",
    report_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (isEdit && editData) {
      const { quarter, year, ...rest } = editData;
      setFormData(rest);
      setQuarter(quarter);
      setAcadYear(year);
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, quarter, year: acadYear };
    try {
      if (isEdit) {
        await apiClient.put(
          `/api/faculty/t2_2organized/${editData.id}/`,
          payload
        );
        setSnackbar({
          open: true,
          message: "Updated successfully",
          severity: "success",
        });
      } else {
        await apiClient.post("/api/faculty/t2_2organized/", payload);
        setSnackbar({
          open: true,
          message: "Submitted successfully",
          severity: "success",
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "A submission error occurred";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEdit
            ? "Edit Organized Program (T2.2)"
            : "Add Organized Program (T2.2)"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          }}
        >
          {/* Session Controls */}
          <FormControl size="small">
            <InputLabel>Quarter</InputLabel>
            <Select
              value={quarter}
              label="Quarter"
              onChange={(e) => setQuarter(e.target.value)}
            >
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={acadYear}
              label="Year"
              onChange={(e) => setAcadYear(e.target.value)}
            >
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Core Fields */}
          <TextField
            name="faculty_name"
            label="Name of Faculty"
            value={formData.faculty_name}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Coordinator">Coordinator</MenuItem>
              <MenuItem value="Co-Coordinator">Co-Coordinator</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="activity_type"
            label="Type of Activity"
            value={formData.activity_type}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <TextField
            name="program_name"
            label="Program Name"
            value={formData.program_name}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <TextField
            name="organized_by_dept"
            label="Organized By (Dept)"
            value={formData.organized_by_dept}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <TextField
            name="place"
            label="Place"
            value={formData.place}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Dates */}
          <TextField
            name="start_date"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date}
            onChange={handleChange}
            size="small"
          />

          <TextField
            name="end_date"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.end_date}
            onChange={handleChange}
            size="small"
          />

          <TextField
            name="num_days"
            label="Number of Days"
            type="number"
            value={formData.num_days}
            onChange={handleChange}
            size="small"
            inputProps={{ min: 0 }}
          />

          <FormControl size="small">
            <InputLabel>Mode</InputLabel>
            <Select
              name="mode"
              value={formData.mode}
              label="Mode"
              onChange={handleChange}
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="num_participants"
            label="Participants"
            type="number"
            value={formData.num_participants}
            onChange={handleChange}
            size="small"
            inputProps={{ min: 0 }}
          />

          <TextField
            name="collaborator"
            label="Collaborator"
            value={formData.collaborator}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          <TextField
            name="report_link"
            label="Report Link"
            type="url"
            placeholder="https://drive.google.com/..."
            helperText="Enter full URL to your Google Drive report"
            value={formData.report_link}
            onChange={handleChange}
            size="small"
            fullWidth
            required
          />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : isEdit ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Box>

        {/* Feedback Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
