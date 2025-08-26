// src/components/S5_1Form.jsx

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

// 1. Define the validation schema to match the backend model
const formSchema = z.object({
  student_name: z.string().min(1, "Student name is required"),
  certification_course: z.string().min(1, "Certification course name is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  credit_points: z.string().min(1, "Credit points are required"),
  certification_type: z.string(),
  certificate_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  student_name: "",
  certification_course: "",
  category: "",
  duration: "",
  credit_points: "",
  certification_type: "Passed",
  certificate_link: "",
  quarter: "",
  year: "",
};

export default function S5_1Form({ session, year, editData, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = Boolean(editData?.id);

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
      : { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() },
  });

  useEffect(() => {
    const defaultValues = editData 
      ? editData 
      : { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() };
    reset(defaultValues);
  }, [editData, session, year, reset]);

  const onFormSubmit = async (data) => {
    try {
      const endpoint = formConfig["S5.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Student certification ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      const errorData = err.response?.data;
      const errorMessage = errorData ? Object.entries(errorData).map(([key, value]) => `${key}: ${value.join(', ')}`).join(' | ') : "Submission failed. Please check the fields and try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Student Certification (S5.1)" : "Add Student Certification (S5.1)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields from Model */}
            <Grid item xs={12}><TextField {...register("student_name")} label="Name of The Student" size="small" fullWidth error={!!errors.student_name} helperText={errors.student_name?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("certification_course")} label="Name of the Certification Course" size="small" fullWidth error={!!errors.certification_course} helperText={errors.certification_course?.message} /></Grid>
            
            {/* --- FIX IS HERE --- */}
            <Grid item xs={12} sm={6}>
              <TextField 
                {...register("category")} 
                label="Category of the Course" 
                size="small" 
                fullWidth 
                error={!!errors.category} 
                helperText={errors.category?.message || "e.g., Computer Science & Engineering"} 
              />
            </Grid>
            
            <Grid item xs={12} sm={6}><TextField {...register("duration")} label="Duration of the Course" size="small" fullWidth error={!!errors.duration} helperText={errors.duration?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("credit_points")} label="Credit Points Earned" size="small" fullWidth error={!!errors.credit_points} helperText={errors.credit_points?.message} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="certification_type" control={control} render={({ field }) => (<FormControl fullWidth size="small"><InputLabel>Certification type</InputLabel><Select {...field} label="Certification type"><MenuItem value="Elite-Gold">Elite-Gold</MenuItem><MenuItem value="Elite-Silver">Elite-Silver</MenuItem><MenuItem value="Passed">Passed</MenuItem><MenuItem value="Other">Other</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12}><TextField {...register("certificate_link")} label="Google Drive Link (Upload Certificate)" size="small" fullWidth error={!!errors.certificate_link} helperText={errors.certificate_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}