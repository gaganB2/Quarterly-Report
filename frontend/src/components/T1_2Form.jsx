// src/components/T1_2Form.jsx

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

// 1. Define the validation schema with Zod
const formSchema = z.object({
  faculty_name: z.string().min(1, "Faculty name is required"),
  title: z.string().min(1, "Title is required"),
  author_type: z.string(),
  internal_authors: z.string().optional(),
  external_authors: z.string().optional(),
  conference_details: z.string().min(1, "Conference details are required"),
  isbn_issn: z.string().optional(),
  publisher: z.string().optional(),
  page_no: z.string().optional(),
  publication_month_year: z
    .string()
    .min(1, "Month & Year are required")
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Must be in MM/YYYY format"),
  indexing_scopus: z.boolean().default(false),
  indexing_other: z.string().optional(),
  conference_status: z.string(),
  conference_mode: z.string(),
  registration_fee_reimbursed: z.boolean().default(false),
  special_leave_dates: z.string().optional(),
  certificate_link: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "",
  title: "",
  author_type: "Sole",
  internal_authors: "",
  external_authors: "",
  conference_details: "",
  isbn_issn: "",
  publisher: "",
  page_no: "",
  publication_month_year: "",
  indexing_scopus: false,
  indexing_other: "",
  conference_status: "National",
  conference_mode: "Offline",
  registration_fee_reimbursed: false,
  special_leave_dates: "",
  certificate_link: "",
  quarter: "",
  year: "",
};

export default function T1_2Form({ session, year, editData, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = Boolean(editData?.id);

  // Set definitive defaultValues to prevent uncontrolled component errors
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

  // Simplified effect to handle prop changes
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

  // Handle the form submission
  const onFormSubmit = async (data) => {
    try {
      const endpoint = formConfig["T1.2"].endpoint;
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
            ? "Edit Conference Paper (T1.2)"
            : "Add Conference Paper (T1.2)"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onFormSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            {/* Session & Year */}
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

            {/* Core Fields */}
            <Grid item xs={12}>
              <TextField
                {...register("faculty_name")}
                label="Name of Faculty"
                size="small"
                fullWidth
                error={!!errors.faculty_name}
                helperText={errors.faculty_name?.message}
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

            {/* Author Details */}
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

            {/* Conference & Publication Details */}
            <Grid item xs={12}>
              <TextField
                {...register("conference_details")}
                label="Conference / Publication Details"
                size="small"
                fullWidth
                error={!!errors.conference_details}
                helperText={errors.conference_details?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("isbn_issn")}
                label="ISBN/ISSN"
                size="small"
                fullWidth
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
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("page_no")}
                label="Page No"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
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

            {/* Indexing */}
            <Grid item xs={12}>
              <FormGroup row>
                <Typography variant="body2" sx={{ mr: 2, alignSelf: "center" }}>
                  Indexing:
                </Typography>
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

            {/* Conference Metadata */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="conference_status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Conference Status</InputLabel>
                    <Select {...field} label="Conference Status">
                      <MenuItem value="National">National</MenuItem>
                      <MenuItem value="International">International</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="conference_mode"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Conference Mode</InputLabel>
                    <Select {...field} label="Conference Mode">
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="Offline">Offline</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("special_leave_dates")}
                label="Special Leave Dates (if any)"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="registration_fee_reimbursed"
                control={control}
                render={({ field }) => (
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Registration Fee Reimbursed"
                    />
                  </FormGroup>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("certificate_link")}
                label="Google Drive Link (Certificate)"
                size="small"
                fullWidth
                error={!!errors.certificate_link}
                helperText={errors.certificate_link?.message}
              />
            </Grid>

            {/* Submit Button */}
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
