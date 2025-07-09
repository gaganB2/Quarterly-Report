import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import MainLayout from "../layout/MainLayout"; // ✅ Wrap inside sidebar layout

const T1ResearchForm = () => {
  const [formData, setFormData] = useState({
    department: "",
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
    quarter: "",
    year: "",
  });

  const [departments, setDepartments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/faculty/departments/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setDepartments(res.data))
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load departments",
          severity: "error",
        });
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/faculty/t1research/", formData, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        setSnackbar({
          open: true,
          message: "Submission successful",
          severity: "success",
        });
        setFormData({
          department: "",
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
          quarter: "",
          year: "",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Submission failed",
          severity: "error",
        });
      });
  };

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Submit Research Article (T1.1)
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            margin="normal"
            required
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Journal Name"
            name="journal_name"
            value={formData.journal_name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Publication Date"
            type="date"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="ISSN Number"
            name="issn_number"
            value={formData.issn_number}
            onChange={handleChange}
            margin="normal"
          />

          {/* Indexing Checkboxes */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Indexing
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {[
              { name: "indexing_wos", label: "Web of Science" },
              { name: "indexing_scopus", label: "Scopus" },
              { name: "indexing_ugc", label: "UGC-CARE" },
            ].map((item) => (
              <label key={item.name}>
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleChange}
                />{" "}
                {item.label}
              </label>
            ))}
          </Box>

          <TextField
            fullWidth
            label="Other Indexing"
            name="indexing_other"
            value={formData.indexing_other}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Internal Authors (BIT Faculty)"
            name="internal_authors"
            value={formData.internal_authors}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="External Authors"
            name="external_authors"
            value={formData.external_authors}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Impact Factor"
            name="impact_factor"
            value={formData.impact_factor}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Document Link"
            name="document_link"
            value={formData.document_link}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            name="quarter"
            label="Quarter"
            value={formData.quarter}
            onChange={handleChange}
            margin="normal"
            required
          >
            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
              <MenuItem key={q} value={q}>
                {q}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 2000, max: 2100 }}
          />

          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default T1ResearchForm;
