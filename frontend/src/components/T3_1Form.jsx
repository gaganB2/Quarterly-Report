// src/components/T3_1Form.jsx
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

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const base = new Date().getFullYear() - 2 + i;
  return { label: `${base} – ${base + 1}`, value: base };
});

export default function T3_1Form({ session, year, editData, onSuccess }) {
  const isEdit = Boolean(editData?.id);
  const [quarter, setQuarter] = useState(session);
  const [acadYear, setAcadYear] = useState(year);
  const [formData, setFormData] = useState({
    faculty_name: "",
    book_title: "",
    author_type: "Sole",
    publisher_details: "",
    isbn_number: "",
    indexing: "",
    publication_year: new Date().getFullYear(),
    print_mode: "Hardcopy",
    book_type: "National",
    proof_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (isEdit && editData) {
      const { quarter, year, ...rest } = editData;
      setFormData(rest);
      setQuarter(quarter);
      setAcadYear(year);
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, quarter, year: acadYear };
    try {
      if (isEdit) {
        await apiClient.put(`/api/faculty/t3_1books/${editData.id}/`, payload);
        setSnack({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await apiClient.post("/api/faculty/t3_1books/", payload);
        setSnack({ open: true, message: "Submitted successfully", severity: "success" });
      }
      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "A submission error occurred";
      setSnack({ open: true, message: msg, severity: "error" });
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
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Edit Book Publication (T3.1)" : "Add Book Publication (T3.1)"}
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
          {/* Quarter & Year */}
          <FormControl size="small">
            <InputLabel>Quarter</InputLabel>
            <Select value={quarter} label="Quarter" onChange={(e) => setQuarter(e.target.value)}>
              {QUARTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select value={acadYear} label="Year" onChange={(e) => setAcadYear(e.target.value)}>
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
          <TextField
            name="book_title"
            label="Book Title"
            value={formData.book_title}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <FormControl size="small">
            <InputLabel>Author Type</InputLabel>
            <Select name="author_type" value={formData.author_type} label="Author Type" onChange={handleChange}>
              <MenuItem value="Sole">Sole</MenuItem>
              <MenuItem value="Co-Author">Co-Author</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="publisher_details"
            label="Publisher Details"
            value={formData.publisher_details}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="isbn_number"
            label="ISSN/ISBN"
            value={formData.isbn_number}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="indexing"
            label="Indexing"
            value={formData.indexing}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <TextField
            name="publication_year"
            label="Year of Publication"
            type="number"
            value={formData.publication_year}
            onChange={handleChange}
            size="small"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
          />
          <FormControl size="small">
            <InputLabel>Print Mode</InputLabel>
            <Select name="print_mode" value={formData.print_mode} label="Print Mode" onChange={handleChange}>
              <MenuItem value="Hardcopy">Hardcopy</MenuItem>
              <MenuItem value="E-print">E-print</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Book Type</InputLabel>
            <Select name="book_type" value={formData.book_type} label="Book Type" onChange={handleChange}>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="proof_link"
            label="Proof Link"
            type="url"
            placeholder="https://..."
            helperText="Full URL to proof document"
            value={formData.proof_link}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Submit Button */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? <CircularProgress size={20} /> : isEdit ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
