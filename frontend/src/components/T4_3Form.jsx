// src/components/T4_3Form.jsx

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
const formSchema = z.object({
  faculty_name: z.string().min(1, "Faculty name is required"),
  body_details: z.string().min(1, "Details of the body/committee are required"),
  responsibility: z.string(),
  level: z.string(),
  other_details: z.string().optional(),
  proof_link: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Proof link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "",
  body_details: "",
  responsibility: "Chairperson",
  level: "University",
  other_details: "",
  proof_link: "",
  quarter: "",
  year: "",
};

export default function T4_3Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["T4.3"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(
        `Committee membership ${
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
            ? "Edit Committee Membership (T4.3)"
            : "Add Committee Membership (T4.3)"}
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
                {...register("body_details")}
                label="Details of the body/committee"
                size="small"
                fullWidth
                error={!!errors.body_details}
                helperText={errors.body_details?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="responsibility"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Responsibility</InputLabel>
                    <Select {...field} label="Responsibility">
                      <MenuItem value="Chairperson">Chairperson</MenuItem>
                      <MenuItem value="Member">Member</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Level</InputLabel>
                    <Select {...field} label="Level">
                      <MenuItem value="University">University</MenuItem>
                      <MenuItem value="State">State</MenuItem>
                      <MenuItem value="National">National</MenuItem>
                      <MenuItem value="International">International</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("other_details")}
                label="Any other details"
                size="small"
                multiline
                rows={3}
                fullWidth
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
