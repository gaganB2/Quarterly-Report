// src/components/T5_4Form.jsx

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
  course_module_name: z.string().min(1, "Course/Module name is required"),
  platform: z.string().min(1, "Platform is required"),
  contributory_institute: z.string().optional(),
  usage_citation: z.string().optional(),
  amount_spent: z.coerce.number().min(0, "Amount must be zero or positive"),
  launch_date: z.string().min(1, "Launch date is required"),
  link: z.string().url("Please enter a valid URL").min(1, "Link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "", course_module_name: "", platform: "", contributory_institute: "",
  usage_citation: "", amount_spent: 0, launch_date: "", link: "",
  quarter: "", year: "",
};

export default function T5_4Form({ session, year, editData, onSuccess }) {
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
      : { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() },
  });

  // Simplified effect to handle prop changes
  useEffect(() => {
    const defaultValues = editData 
      ? editData 
      : { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() };
    reset(defaultValues);
  }, [editData, session, year, reset]);

  // Handle the form submission
  const onFormSubmit = async (data) => {
    try {
      const endpoint = formConfig["T5.4"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Course development entry ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar("Submission failed. Please check the fields and try again.", { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Course Development (T5.4)" : "Add Course Development (T5.4)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields */}
            <Grid item xs={12}><TextField {...register("faculty_name")} label="Name of Faculty" size="small" fullWidth error={!!errors.faculty_name} helperText={errors.faculty_name?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("course_module_name")} label="Name of Course/Module" size="small" fullWidth error={!!errors.course_module_name} helperText={errors.course_module_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("platform")} label="Platform (Moodle, Gsuite, etc.)" size="small" fullWidth error={!!errors.platform} helperText={errors.platform?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("contributory_institute")} label="Other Contributory Institute" size="small" fullWidth /></Grid>
            <Grid item xs={12}><TextField {...register("usage_citation")} label="Usage and Citation etc." size="small" multiline rows={3} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("amount_spent")} label="Amount Spent (if any)" type="number" size="small" fullWidth error={!!errors.amount_spent} helperText={errors.amount_spent?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("launch_date")} label="Date of Launching Content" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.launch_date} helperText={errors.launch_date?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("link")} label="Google Drive or Content Link" size="small" fullWidth error={!!errors.link} helperText={errors.link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Submit"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}