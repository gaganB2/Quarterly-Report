// src/components/T1_1Form.jsx

import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// Validation schema for the form
const formSchema = z.object({
  faculty_name: z.string().min(1, "Faculty name is required"),
  title: z.string().min(1, "Title is required"),
  author_type: z.string(),
  internal_authors: z.string().optional(),
  external_authors: z.string().optional(),
  journal_name: z.string().min(1, "Journal name is required"),
  volume: z.string().optional(),
  issue: z.string().optional(),
  page_no: z.string().optional(),
  publication_month_year: z
    .string()
    .min(1, "Month & Year are required")
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Must be in MM/YYYY format"),
  issn_number: z.string().optional(),
  impact_factor: z.string().optional(),
  publisher: z.string().optional(),
  indexing_wos: z.boolean().default(false),
  indexing_scopus: z.boolean().default(false),
  indexing_ugc: z.boolean().default(false),
  indexing_other: z.string().optional(),
  doi: z.string().optional(),
  google_drive_link: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  department: z.string().min(1, "Department is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// --- FIX 1: Add default quarter and year to the initialState ---
const initialState = {
  faculty_name: "",
  title: "",
  author_type: "Sole",
  internal_authors: "",
  external_authors: "",
  journal_name: "",
  volume: "",
  issue: "",
  page_no: "",
  publication_month_year: "",
  issn_number: "",
  impact_factor: "",
  publisher: "",
  indexing_wos: false,
  indexing_scopus: false,
  indexing_ugc: false,
  indexing_other: "",
  doi: "",
  google_drive_link: "",
  department: "",
  quarter: "",
  year: "",
};

export default function T1_1Form({ session, year, editData, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = Boolean(editData?.id);

  // --- FIX 2: Set definitive defaultValues right away ---
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: editData
      ? editData
      : {
          ...initialState,
          quarter: session,
          year: parseInt(year, 10) || new Date().getFullYear(),
        },
  });

  // --- FIX 3: Simplify the useEffect to only handle prop changes ---
  useEffect(() => {
    const defaultValues = editData
      ? editData
      : {
          ...initialState,
          quarter: session,
          year: parseInt(year, 10) || new Date().getFullYear(),
        };
    reset(defaultValues);
  }, [editData, session, year, reset]);

  const onFormSubmit = async (data) => {
    try {
      const endpoint = formConfig["T1.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(
        `Entry ${isEditMode ? "updated" : "submitted"} successfully!`,
        { variant: "success" }
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar(
        "Submission failed. Please check the fields and try again.",
        { variant: "error" }
      );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode
            ? "Edit Research Article (T1.1)"
            : "Add Research Article (T1.1)"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onFormSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="quarter"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.quarter}>
                    <InputLabel>Quarter</InputLabel>
                    <Select {...field} label="Quarter">
                      {QUARTER_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.year}>
                    <InputLabel>Year</InputLabel>
                    <Select {...field} label="Year">
                      {YEAR_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("faculty_name")}
                label="Name of Faculty"
                size="small"
                fullWidth
                error={!!errors.faculty_name}
                helperText={errors.faculty_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("department")}
                label="Department"
                size="small"
                fullWidth
                error={!!errors.department}
                helperText={errors.department?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("title")}
                label="Title"
                size="small"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="author_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Author Type</InputLabel>
                    <Select {...field} label="Author Type">
                      <MenuItem value="Sole">Sole</MenuItem>
                      <MenuItem value="First">First</MenuItem>
                      <MenuItem value="Corresponding">Corresponding</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("internal_authors")}
                label="Internal Authors"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("external_authors")}
                label="External Authors"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                {...register("journal_name")}
                label="Journal Name"
                size="small"
                fullWidth
                error={!!errors.journal_name}
                helperText={errors.journal_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("publisher")}
                label="Publisher"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                {...register("volume")}
                label="Volume"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                {...register("issue")}
                label="Issue"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                {...register("page_no")}
                label="Page No"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                {...register("publication_month_year")}
                label="Month & Year"
                placeholder="MM/YYYY"
                size="small"
                fullWidth
                error={!!errors.publication_month_year}
                helperText={errors.publication_month_year?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("issn_number")}
                label="ISSN Number"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("impact_factor")}
                label="Impact Factor"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("doi")}
                label="DOI"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("google_drive_link")}
                label="Google Drive Link (Proof)"
                size="small"
                fullWidth
                error={!!errors.google_drive_link}
                helperText={errors.google_drive_link?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <Typography variant="body2" sx={{ mr: 2, alignSelf: "center" }}>
                  Indexing:
                </Typography>
                <Controller
                  name="indexing_wos"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="WOS"
                    />
                  )}
                />
                <Controller
                  name="indexing_scopus"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Scopus"
                    />
                  )}
                />
                <Controller
                  name="indexing_ugc"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="UGC Care"
                    />
                  )}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("indexing_other")}
                label="Other Indexing"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
            >
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  "Update Entry"
                ) : (
                  "Submit Entry"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}
