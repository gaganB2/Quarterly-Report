// src/components/T3_2Form.jsx
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

// Helper to pick current quarter and academic year
const getCurrentQuarter = () => {
  const m = new Date().getMonth() + 1;
  if (m <= 3) return "Q3";
  if (m <= 6) return "Q4";
  if (m <= 9) return "Q1";
  return "Q2";
};
const getCurrentAcademicYear = () => {
  const now = new Date();
  return now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
};

const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (July – September)" },
  { value: "Q2", label: "Q2 (October – December)" },
  { value: "Q3", label: "Q3 (January – March)" },
  { value: "Q4", label: "Q4 (April – June)" },
];
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const start = 2000 + i;
  return {
    value: start,
    label: `${start} – ${start + 1}`
  };
});

export default function T3_2Form({ session, year, editData, onSuccess }) {
  const isEdit = Boolean(editData?.id);
  const [quarter, setQuarter] = useState(session || getCurrentQuarter());
  const [acadYear, setAcadYear] = useState(year || getCurrentAcademicYear());
  const [formData, setFormData] = useState({
    faculty_name: "",
    chapter_title: "",
    author_type: "Sole",
    publisher_details: "",
    isbn_number: "",
    indexing: "",
    publication_year: new Date().getFullYear(),
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
        await apiClient.put(`/api/faculty/t3_2chapters/${editData.id}/`, payload);
        setSnack({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await apiClient.post("/api/faculty/t3_2chapters/", payload);
        setSnack({ open: true, message: "Submitted successfully", severity: "success" });
      }
      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data ? JSON.stringify(err.response.data) : "Submission error";
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
      {/* USE outlined variant, NO elevation prop anywhere */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Edit Chapter Publication (T3.2)" : "Add Chapter Publication (T3.2)"}
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
            <Select
              value={quarter}
              label="Quarter"
              onChange={(e) => setQuarter(e.target.value)}
            >
              {QUARTER_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
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
              {YEAR_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
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
            name="chapter_title"
            label="Chapter Title"
            value={formData.chapter_title}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <FormControl size="small">
            <InputLabel>Author Type</InputLabel>
            <Select
              name="author_type"
              value={formData.author_type}
              label="Author Type"
              onChange={handleChange}
            >
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
            <InputLabel>Book Type</InputLabel>
            <Select
              name="book_type"
              value={formData.book_type}
              label="Book Type"
              onChange={handleChange}
            >
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="International">International</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="proof_link"
            label="Proof Link"
            type="url"
            placeholder="https://"
            helperText="Full URL to proof document"
            value={formData.proof_link}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* Submit */}
          <Box sx={{ gridColumn: "1 / -1", textAlign: "right", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
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
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </motion.div>
  );
}
