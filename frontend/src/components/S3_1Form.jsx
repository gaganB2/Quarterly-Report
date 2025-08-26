// src/components/S3_1Form.jsx

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

// Validation schema uses the correct field name 'date'
const formSchema = z.object({
  student_name: z.string().min(1, "Student name is required"),
  semester: z.string().min(1, "Semester is required"),
  activity_type: z.string().min(1, "Activity type is required"),
  organized_by: z.string().min(1, "Organizer is required"),
  date: z.string().min(1, "Date of participation is required"),
  level: z.string(),
  awards: z.string().optional(),
  proof_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// initialState uses the correct field name 'date' and a valid default for 'level'
const initialState = {
  student_name: "",
  semester: "",
  activity_type: "",
  organized_by: "",
  date: "", 
  level: "Regional", // Default to a valid choice
  awards: "",
  proof_link: "",
  quarter: "",
  year: "",
};

export default function S3_1Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["S3.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Competition entry ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      // --- FIX 1: The incomplete error handling logic is now complete and robust ---
      const errorData = err.response?.data;
      let errorMessage = "Submission failed. Please check the fields and try again.";
      if (errorData) {
        // Create a user-friendly error message from the server's response
        errorMessage = Object.entries(errorData).map(([key, value]) => `${key}: ${value.join(', ')}`).join(' | ');
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Competition Participation (S3.1)" : "Add Competition Participation (S3.1)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields from Model */}
            <Grid item xs={12} sm={6}><TextField {...register("student_name")} label="Name of The Student" size="small" fullWidth error={!!errors.student_name} helperText={errors.student_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("semester")} label="Semester" size="small" fullWidth error={!!errors.semester} helperText={errors.semester?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("activity_type")} label="Type of Activity (Sports/Cultural etc.)" size="small" fullWidth error={!!errors.activity_type} helperText={errors.activity_type?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("organized_by")} label="Organized By" size="small" fullWidth error={!!errors.organized_by} helperText={errors.organized_by?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("date")} label="Date of Participation" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.date} helperText={errors.date?.message} /></Grid>
            
            {/* --- FIX 2: The MenuItem values now EXACTLY match the backend model --- */}
            <Grid item xs={12} sm={6}>
              <Controller name="level" control={control} render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.level}>
                  <InputLabel>Level</InputLabel>
                  <Select {...field} label="Level">
                    <MenuItem value="Regional">Regional</MenuItem>
                    <MenuItem value="National">National</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                  </Select>
                </FormControl>
              )}/>
            </Grid>
            
            <Grid item xs={12}><TextField {...register("awards")} label="Awards (if any)" size="small" fullWidth /></Grid>
            <Grid item xs={12}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}