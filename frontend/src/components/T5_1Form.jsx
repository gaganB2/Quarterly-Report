// src/components/T5_1Form.jsx

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
  Button,
  CircularProgress,
  Grid,
  FormControlLabel,
  Checkbox,
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
const formSchema = z
  .object({
    faculty_name: z.string().min(1, "Faculty name is required"),
    title: z.string().min(1, "Title is required"),
    internal_co_inventors: z.string().optional(),
    external_co_inventors: z.string().optional(),
    ipr_type: z.string(),
    application_number: z.string().min(1, "Application Number is required"),
    status: z.string(),
    filled_date: z.string().min(1, "Filed Date is required"),
    published_granted_date: z.string().optional(),
    publication_number: z.string().optional(),
    technology_transfer: z.boolean().default(false),
    country: z.string().min(1, "Country is required"),
    proof_link: z
      .string()
      .url("Please enter a valid URL")
      .min(1, "Proof link is required"),
    quarter: z.string().min(1, "Quarter is required"),
    year: z.number({ required_error: "Year is required" }),
  })
  .refine(
    (data) => {
      if (data.status === "Published" || data.status === "Granted") {
        return !!data.published_granted_date;
      }
      return true;
    },
    {
      message: "Date is required if status is Published or Granted",
      path: ["published_granted_date"],
    }
  );

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "",
  title: "",
  internal_co_inventors: "",
  external_co_inventors: "",
  ipr_type: "Utility",
  application_number: "",
  status: "Filed",
  filled_date: "",
  published_granted_date: "",
  publication_number: "",
  technology_transfer: false,
  country: "",
  proof_link: "",
  quarter: "",
  year: "",
};

export default function T5_1Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["T5.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(
        `Patent details ${isEditMode ? "updated" : "added"} successfully!`,
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
            ? "Edit Patent Details (T5.1)"
            : "Add Patent Details (T5.1)"}
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

            {/* Form Fields */}
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
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("internal_co_inventors")}
                label="Internal Co-Inventors"
                size="small"
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("external_co_inventors")}
                label="External Co-Inventors"
                size="small"
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="ipr_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Type of IPR</InputLabel>
                    <Select {...field} label="Type of IPR">
                      <MenuItem value="Utility">Utility</MenuItem>
                      <MenuItem value="Process">Process</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="Copyright">Copyright</MenuItem>
                      <MenuItem value="Trademark">Trademark</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="Filed">Filed</MenuItem>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Granted">Granted</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("application_number")}
                label="Application Number"
                size="small"
                fullWidth
                error={!!errors.application_number}
                helperText={errors.application_number?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("publication_number")}
                label="Publication/Granted Number"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("filled_date")}
                label="Filed Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                error={!!errors.filled_date}
                helperText={errors.filled_date?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("published_granted_date")}
                label="Published/Granted Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                error={!!errors.published_granted_date}
                helperText={errors.published_granted_date?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("country")}
                label="Country of Patent"
                size="small"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Controller
                name="technology_transfer"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Technology Transfer Applicable"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("proof_link")}
                label="Google Drive Link (Upload Proof)"
                size="small"
                fullWidth
                error={!!errors.proof_link}
                helperText={errors.proof_link?.message}
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
