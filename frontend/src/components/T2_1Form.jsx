// src/components/T2_1Form.jsx

import React, { useEffect } from "react";
import {
  Box, Paper, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Checkbox, FormControlLabel, Button,
  CircularProgress, Grid, FormGroup,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";
import { QUARTER_OPTIONS, YEAR_OPTIONS } from "../config/formConstants";
import { formConfig } from "../config/formConfig";

const formSchema = z.object({
  faculty_name: z.string().min(1, "Faculty name is required"),
  program_name: z.string().min(1, "Program name is required"),
  organizer: z.string().min(1, "Organizer is required"),
  place: z.string().min(1, "Place is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  num_days: z.coerce.number().min(1, "Must be at least 1 day"),
  mode: z.string(),
  registration_fee_reimbursed: z.boolean().default(false),
  special_leave_dates: z.string().optional(),
  certificate_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"), // Added validation
  year: z.number({ required_error: "Year is required" }), // Added validation
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date cannot be before start date",
  path: ["end_date"],
});

// --- FIX 1: Add default quarter and year to the initialState ---
// We use empty strings as a safe default for controlled components.
const initialState = {
  faculty_name: "",
  program_name: "",
  organizer: "",
  place: "",
  start_date: "",
  end_date: "",
  num_days: 0,
  mode: "Offline",
  registration_fee_reimbursed: false,
  special_leave_dates: "",
  certificate_link: "",
  quarter: "", // <-- ADD THIS
  year: "",    // <-- ADD THIS
};

export default function T2_1Form({ session, year, editData, onSuccess }) {
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
    // --- FIX 2: Set definitive defaultValues right away ---
    // This ensures the form is NEVER uncontrolled.
    defaultValues: editData 
        ? { ...initialState, ...editData } 
        : { ...initialState, quarter: session, year: parseInt(year, 10) },
  });

  // --- FIX 3: Simplify the useEffect hook ---
  // Its only job now is to reset the form if the `editData` prop changes.
  useEffect(() => {
    const defaultValues = editData
      ? { ...initialState, ...editData }
      : { ...initialState, quarter: session, year: parseInt(year, 10) };
    reset(defaultValues);
  }, [editData, session, year, reset]);


  const onFormSubmit = async (data) => {
    try {
      const endpoint = formConfig["T2.1"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";

      await apiClient[method](url, data);
      enqueueSnackbar(`Entry ${isEditMode ? "updated" : "submitted"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar("Submission failed. Please check the fields and try again.", { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Workshop Attendance (T2.1)" : "Add Workshop Attendance (T2.1)"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}>
              <Controller name="quarter" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.quarter}>
                    <InputLabel>Quarter</InputLabel>
                    <Select {...field} label="Quarter">
                      {QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="year" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.year}>
                    <InputLabel>Year</InputLabel>
                    <Select {...field} label="Year">
                      {YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* The rest of the form remains the same... */}
            <Grid item xs={12}><TextField {...register("faculty_name")} label="Name of Faculty" size="small" fullWidth error={!!errors.faculty_name} helperText={errors.faculty_name?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("program_name")} label="Name of FDP/STTP/Workshop" size="small" fullWidth error={!!errors.program_name} helperText={errors.program_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("organizer")} label="Organized by" size="small" fullWidth error={!!errors.organizer} helperText={errors.organizer?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("place")} label="Place" size="small" fullWidth error={!!errors.place} helperText={errors.place?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("start_date")} label="Program Start Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.start_date} helperText={errors.start_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("end_date")} label="Program End Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.end_date} helperText={errors.end_date?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("num_days")} label="Number of Days" type="number" size="small" fullWidth error={!!errors.num_days} helperText={errors.num_days?.message} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="mode" control={control} render={({ field }) => ( <FormControl fullWidth size="small"><InputLabel>Mode</InputLabel><Select {...field} label="Mode"><MenuItem value="Online">Online</MenuItem><MenuItem value="Offline">Offline</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}><Controller name="registration_fee_reimbursed" control={control} render={({ field }) => ( <FormGroup><FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Registration Fee Reimbursed" /></FormGroup>)}/></Grid>
            <Grid item xs={12}><TextField {...register("special_leave_dates")} label="Special Leave Dates (if any)" size="small" fullWidth /></Grid>
            <Grid item xs={12}><TextField {...register("certificate_link")} label="Google Drive Link (Certificate)" size="small" fullWidth error={!!errors.certificate_link} helperText={errors.certificate_link?.message} /></Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}