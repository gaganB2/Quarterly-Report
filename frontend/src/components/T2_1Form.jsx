// src/components/T2_1Form.jsx
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

export default function T2_1Form({ session, year, editData, onSuccess }) {
  const isEdit = Boolean(editData?.id);
  const [q, setQ] = useState(session);
  const [y, setY] = useState(year);

  const [formData, setFormData] = useState({
    faculty_name: "",
    program_name: "",
    organizer: "",
    place: "",
    start_date: "",
    end_date: "",
    num_days: 0,
    mode: "Offline",
    registration_fee_reimbursed: false,
    special_leave_dates: "",
    certificate_link: "",
  });

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (isEdit && editData) {
      const { id, user, department, created_at, updated_at, quarter, year, ...rest } = editData;
      setFormData(rest);
      setQ(quarter);
      setY(year);
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
    const payload = { ...formData, quarter: q, year: y };
    try {
      if (isEdit) {
        await apiClient.put(`/api/faculty/t2_1workshops/${editData.id}/`, payload);
        setSnack({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await apiClient.post("/api/faculty/t2_1workshops/", payload);
        setSnack({ open: true, message: "Submitted successfully", severity: "success" });
      }
      onSuccess();
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data || "Error occurred", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Edit Workshop Attendance (T2.1)" : "Add Workshop Attendance (T2.1)"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          {/* Quarter & Year */}
          <FormControl fullWidth size="small">
            <InputLabel>Quarter</InputLabel>
            <Select value={q} label="Quarter" onChange={(e) => setQ(e.target.value)}>
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select value={y} label="Year" onChange={(e) => setY(e.target.value)}>
              {YEAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Core fields */}
          <TextField name="faculty_name" label="Name of Faculty" value={formData.faculty_name} onChange={handleChange} fullWidth size="small" />
          <TextField name="program_name" label="Name of FDP/STTP/Workshop" value={formData.program_name} onChange={handleChange} fullWidth size="small" />
          <TextField name="organizer" label="Organized by" value={formData.organizer} onChange={handleChange} fullWidth size="small" />
          <TextField name="place" label="Place" value={formData.place} onChange={handleChange} fullWidth size="small" />

          {/* Date fields */}
          <TextField name="start_date" label="Program Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={handleChange} fullWidth size="small" />
          <TextField name="end_date" label="Program End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={handleChange} fullWidth size="small" />

          <TextField name="num_days" label="Number of Days" type="number" value={formData.num_days} onChange={handleChange} fullWidth size="small" />

          {/* Mode & fee */}
          <FormControl fullWidth size="small">
            <InputLabel>Mode</InputLabel>
            <Select name="mode" value={formData.mode} label="Mode" onChange={handleChange}>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox name="registration_fee_reimbursed" checked={formData.registration_fee_reimbursed} onChange={handleChange} />}
            label="Registration Fee Reimbursed"
            sx={{ width: "100%" }}
          />

          <TextField name="special_leave_dates" label="Special Leave Dates" value={formData.special_leave_dates} onChange={handleChange} fullWidth size="small" />
          <TextField name="certificate_link" label="Google Drive Link" value={formData.certificate_link} onChange={handleChange} fullWidth size="small" />

          {/* Submit */}
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEdit ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
