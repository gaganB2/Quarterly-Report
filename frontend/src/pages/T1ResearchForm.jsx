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

const T1ResearchForm = () => {
  const [formData, setFormData] = useState({
    department: "",
    title: "",
    journal_name: "",
    publication_date: "",
    issn_number: "",
    indexing: "",
    impact_factor: "",
    co_authors: "",
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
      .catch((err) => {
        console.error("Failed to load departments", err);
        setSnackbar({
          open: true,
          message: "Failed to load departments",
          severity: "error",
        });
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
          indexing: "",
          impact_factor: "",
          co_authors: "",
          document_link: "",
          quarter: "",
          year: "",
        });
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setSnackbar({
          open: true,
          message: "Submission failed",
          severity: "error",
        });
      });
  };

  return (
    <Container maxWidth="sm">
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
        <TextField
          fullWidth
          label="Indexing"
          name="indexing"
          value={formData.indexing}
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
          label="Co-Authors"
          name="co_authors"
          value={formData.co_authors}
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
          <MenuItem value="Q1">Q1</MenuItem>
          <MenuItem value="Q2">Q2</MenuItem>
          <MenuItem value="Q3">Q3</MenuItem>
          <MenuItem value="Q4">Q4</MenuItem>
        </TextField>

        {/* <TextField fullWidth label="Year" name="year" type="number" value={formData.year} onChange={handleChange} margin="normal" required /> */}
        <TextField
          fullWidth
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          margin="normal"
          required
          inputProps={{
            min: 2000,
            max: 2100,
            step: 1,
          }}
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
  );
};

export default T1ResearchForm;
