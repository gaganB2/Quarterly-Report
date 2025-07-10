import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
// import MainLayout from "../layout/MainLayout";
import apiClient from "../api/axios";


const T1ResearchForm = () => {
  // form state
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
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // load departments on mount
  useEffect(() => {
    let mounted = true;
    apiClient
      .get("api/faculty/departments/")
      .then((res) => {
        if (mounted) setDepartments(res.data);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Failed to load departments", severity: "error" });
      })
      .finally(() => {
        if (mounted) setLoadingDeps(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("api/faculty/t1research/", formData);
      setSnackbar({ open: true, message: "Submission successful", severity: "success" });
      // reset form
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
    } catch {
      setSnackbar({ open: true, message: "Submission failed", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <MainLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)"
                  : undefined,
            }}
          >
            {/* Form Header */}
            <Box mb={3}>
              <Typography variant="h5" fontWeight={600}>
                Submit Research Article (T1.1)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details below and click Submit.
              </Typography>
            </Box>

            {/* Show loader until departments load */}
            {loadingDeps ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Department */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="department"
                      label="Department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Title */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  {/* Journal Name */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Journal Name"
                      name="journal_name"
                      value={formData.journal_name}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Publication Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Publication Date"
                      type="date"
                      name="publication_date"
                      value={formData.publication_date}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* ISSN */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ISSN Number"
                      name="issn_number"
                      value={formData.issn_number}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Indexing */}
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Indexing</FormLabel>
                      <FormGroup row>
                        {[
                          { name: "indexing_wos", label: "Web of Science" },
                          { name: "indexing_scopus", label: "Scopus" },
                          { name: "indexing_ugc", label: "UGC-CARE" },
                        ].map((opt) => (
                          <FormControlLabel
                            key={opt.name}
                            control={
                              <Checkbox
                                name={opt.name}
                                checked={formData[opt.name]}
                                onChange={handleChange}
                              />
                            }
                            label={opt.label}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>

                  {/* Other Indexing */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Other Indexing"
                      name="indexing_other"
                      value={formData.indexing_other}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Authors */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Internal Authors (BIT Faculty)"
                      name="internal_authors"
                      value={formData.internal_authors}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="External Authors"
                      name="external_authors"
                      value={formData.external_authors}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Impact Factor */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Impact Factor"
                      name="impact_factor"
                      value={formData.impact_factor}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Document Link */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Document Link"
                      name="document_link"
                      value={formData.document_link}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Quarter */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="quarter"
                      label="Quarter"
                      value={formData.quarter}
                      onChange={handleChange}
                      required
                    >
                      {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                        <MenuItem key={q} value={q}>
                          {q}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Year */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      name="year"
                      label="Year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      inputProps={{ min: 2000, max: 2100 }}
                    />
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Box mt={4} textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    sx={{ px: 6 }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Global Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    // </MainLayout>
  );
};

export default T1ResearchForm;
