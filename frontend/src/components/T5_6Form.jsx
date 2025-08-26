// src/components/T5_6Form.jsx

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
    role: z.string(),
    candidate_name: z.string().min(1, "Candidate name is required"),
    enrollment_number: z.string().min(1, "Enrollment number is required"),
    thesis_title: z.string().min(1, "Thesis title is required"),
    registration_date: z.string().min(1, "Registration date is required"),
    viva_voce_date: z.string().optional(),
    external_examiner_details: z.string().optional(),
    status: z.string(),
    research_center: z.string().min(1, "Research center is required"),
    conferring_university: z
      .string()
      .min(1, "Conferring university is required"),
    proof_link: z
      .string()
      .url("Please enter a valid URL")
      .min(1, "Proof link is required"),
    quarter: z.string().min(1, "Quarter is required"),
    year: z.number({ required_error: "Year is required" }),
  })
  .refine(
    (data) => {
      if (data.status === "Completed") {
        return !!data.viva_voce_date;
      }
      return true;
    },
    {
      message: "Viva-Voce date is required if status is 'Completed'",
      path: ["viva_voce_date"],
    }
  );

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "",
  role: "Supervisor",
  candidate_name: "",
  enrollment_number: "",
  thesis_title: "",
  registration_date: "",
  viva_voce_date: "",
  external_examiner_details: "",
  status: "Ongoing",
  research_center: "",
  conferring_university: "",
  proof_link: "",
  quarter: "",
  year: "",
};

export default function T5_6Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["T5.6"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(
        `Research guidance entry ${
          isEditMode ? "updated" : "added"
        } successfully!`,
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
            ? "Edit Research Guidance (T5.6)"
            : "Add Research Guidance (T5.6)"}
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
            <Grid item xs={12} sm={8}>
              <TextField
                {...register("faculty_name")}
                label="Name of Faculty"
                size="small"
                fullWidth
                error={!!errors.faculty_name}
                helperText={errors.faculty_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="Supervisor">Supervisor</MenuItem>
                      <MenuItem value="Co-Supervisor">Co-Supervisor</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("candidate_name")}
                label="Name of Candidate"
                size="small"
                fullWidth
                error={!!errors.candidate_name}
                helperText={errors.candidate_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("enrollment_number")}
                label="Enrollment No."
                size="small"
                fullWidth
                error={!!errors.enrollment_number}
                helperText={errors.enrollment_number?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("thesis_title")}
                label="Title of Thesis"
                size="small"
                fullWidth
                error={!!errors.thesis_title}
                helperText={errors.thesis_title?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("registration_date")}
                label="Date of Registration"
                type="date"
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                error={!!errors.registration_date}
                helperText={errors.registration_date?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("viva_voce_date")}
                label="Date of PhD Viva-Voce"
                type="date"
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                error={!!errors.viva_voce_date}
                helperText={errors.viva_voce_date?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("research_center")}
                label="Name of the Research Center"
                size="small"
                fullWidth
                error={!!errors.research_center}
                helperText={errors.research_center?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("conferring_university")}
                label="PhD Conferring University"
                size="small"
                fullWidth
                error={!!errors.conferring_university}
                helperText={errors.conferring_university?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("external_examiner_details")}
                label="Complete Details of External Examiner"
                size="small"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("proof_link")}
                label="Google Drive Link (Proof)"
                size="small"
                fullWidth
                error={!!errors.proof_link}
                helperText={
                  errors.proof_link?.message ||
                  "Ongoing: RDC Letter | Completed: Notification Letter"
                }
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
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}
