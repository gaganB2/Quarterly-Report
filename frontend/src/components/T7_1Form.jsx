// src/components/T7_1Form.jsx

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
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

// 1. Define the validation schema with Zod
const formSchema = z.object({
  organizer_name: z.string().min(1, "Organizer name is required"),
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.string().min(1, "Event type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  num_days: z.coerce.number().min(1, "Duration must be at least 1 day"),
  mode: z.string(),
  participants_count: z.coerce.number().min(1, "Must be at least 1 participant"),
  collaborator_details: z.string().optional(),
  report_link: z.string().url("Please enter a valid URL").min(1, "Report link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date cannot be before start date",
  path: ["end_date"],
});

// Add default quarter and year to the initialState
const initialState = {
  organizer_name: "", event_name: "", event_type: "", start_date: "",
  end_date: "", num_days: 0, mode: "Offline", participants_count: 0,
  collaborator_details: "", report_link: "",
  quarter: "", year: "",
};

export default function T7_1Form({ session, year, editData, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = Boolean(editData?.id);

  // Set definitive defaultValues to prevent uncontrolled component errors
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: editData 
      ? editData 
      : { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() },
  });
  
  const [startDate, endDate] = useWatch({ control, name: ["start_date", "end_date"] });

  // Effect to automatically calculate the number of days
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setValue("num_days", diffDays, { shouldValidate: true });
      } else {
        setValue("num_days", 0);
      }
    }
  }, [startDate, endDate, setValue]);

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
      const endpoint = formConfig["T7.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Program ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar("Submission failed. Please check the fields and try again.", { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Organized Program (T7.1)" : "Add Organized Program (T7.1)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            
            {/* Form Fields */}
            <Grid item xs={12}><TextField {...register("organizer_name")} label="Name of the Organizer" size="small" fullWidth error={!!errors.organizer_name} helperText={errors.organizer_name?.message || "Clubs/Professional Bodies, etc"} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("event_name")} label="Name of the Event/Competition" size="small" fullWidth error={!!errors.event_name} helperText={errors.event_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("event_type")} label="Type of Event/Competition" size="small" fullWidth error={!!errors.event_type} helperText={errors.event_type?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("start_date")} label="Program Start Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.start_date} helperText={errors.start_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("end_date")} label="Program End Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.end_date} helperText={errors.end_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("num_days")} label="Number of Days (Calculated)" type="number" size="small" fullWidth disabled error={!!errors.num_days} helperText={errors.num_days?.message} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="mode" control={control} render={({ field }) => ( <FormControl fullWidth size="small"><InputLabel>Mode</InputLabel><Select {...field} label="Mode"><MenuItem value="Online">Online</MenuItem><MenuItem value="Offline">Offline</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("participants_count")} label="Number of Participants" type="number" size="small" fullWidth error={!!errors.participants_count} helperText={errors.participants_count?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("collaborator_details")} label="Collaborator (if any)" size="small" multiline rows={3} fullWidth error={!!errors.collaborator_details} helperText={errors.collaborator_details?.message || "Include complete contact details"} /></Grid>
            <Grid item xs={12}><TextField {...register("report_link")} label="Google Drive Link (Upload Report)" size="small" fullWidth error={!!errors.report_link} helperText={errors.report_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Submit"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}