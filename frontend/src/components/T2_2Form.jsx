// src/components/T2_2Form.jsx

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
  role: z.string(),
  activity_type: z.string().min(1, "Activity type is required"),
  program_name: z.string().min(1, "Program name is required"),
  organized_by_dept: z.string().min(1, "Organizing department is required"),
  place: z.string().min(1, "Place is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  num_days: z.coerce.number().min(1, "Must be at least 1 day"),
  mode: z.string(),
  num_participants: z.coerce.number().min(1, "Must be at least 1 participant"),
  collaborator: z.string().optional(),
  report_link: z.string().url("Please enter a valid URL").min(1, "Report link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date cannot be before start date",
  path: ["end_date"],
});

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "", role: "Coordinator", activity_type: "", program_name: "",
  organized_by_dept: "", place: "", start_date: "", end_date: "",
  num_days: 0, mode: "Offline", num_participants: 0, collaborator: "",
  report_link: "", quarter: "", year: "",
};

export default function T2_2Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["T2.2"].endpoint;
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
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Organized Program (T2.2)" : "Add Organized Program (T2.2)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Core Fields */}
            <Grid item xs={12} sm={8}><TextField {...register("faculty_name")} label="Name of Faculty" size="small" fullWidth error={!!errors.faculty_name} helperText={errors.faculty_name?.message} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="role" control={control} render={({ field }) => (<FormControl fullWidth size="small"><InputLabel>Role</InputLabel><Select {...field} label="Role"><MenuItem value="Coordinator">Coordinator</MenuItem><MenuItem value="Co-Coordinator">Co-Coordinator</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12}><TextField {...register("program_name")} label="Program Name" size="small" fullWidth error={!!errors.program_name} helperText={errors.program_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("activity_type")} label="Type of Activity (FDP, STTP, etc.)" size="small" fullWidth error={!!errors.activity_type} helperText={errors.activity_type?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("organized_by_dept")} label="Organized By (Dept)" size="small" fullWidth error={!!errors.organized_by_dept} helperText={errors.organized_by_dept?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("place")} label="Place" size="small" fullWidth error={!!errors.place} helperText={errors.place?.message} /></Grid>
            
            {/* Dates & Duration */}
            <Grid item xs={12} sm={4}><TextField {...register("start_date")} label="Start Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.start_date} helperText={errors.start_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("end_date")} label="End Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.end_date} helperText={errors.end_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("num_days")} label="Number of Days" type="number" size="small" fullWidth error={!!errors.num_days} helperText={errors.num_days?.message} /></Grid>

            {/* Participants & Mode */}
            <Grid item xs={12} sm={6}><Controller name="mode" control={control} render={({ field }) => (<FormControl fullWidth size="small"><InputLabel>Mode</InputLabel><Select {...field} label="Mode"><MenuItem value="Online">Online</MenuItem><MenuItem value="Offline">Offline</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("num_participants")} label="Number of Participants" type="number" size="small" fullWidth error={!!errors.num_participants} helperText={errors.num_participants?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("collaborator")} label="Collaborator (if any)" size="small" fullWidth /></Grid>
            
            {/* Report Link */}
            <Grid item xs={12}><TextField {...register("report_link")} label="Google Drive Link (Report)" size="small" fullWidth error={!!errors.report_link} helperText={errors.report_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}