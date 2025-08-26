// src/components/S5_3Form.jsx

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
  student_name: z.string().min(1, "Student/Alumni name is required"),
  award_name: z.string().min(1, "Award name is required"),
  work_title: z.string().min(1, "Work title is required"),
  date_received: z.string().min(1, "Date of award is required"),
  awarding_organization: z.string().min(1, "Awarding organization is required"),
  award_amount: z.coerce.number().min(0, "Amount must be a positive number").optional().nullable(),
  award_level: z.string(),
  proof_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  student_name: "",
  award_name: "",
  work_title: "",
  date_received: "",
  awarding_organization: "",
  award_amount: 0,
  award_level: "University",
  proof_link: "",
  quarter: "",
  year: "",
};

export default function S5_3Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["S5.3"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Achievement entry ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
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
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Achievement/Award (S5.3)" : "Add Achievement/Award (S5.3)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields from Model */}
            <Grid item xs={12}><TextField {...register("student_name")} label="Name of the Student/Alumni" size="small" fullWidth error={!!errors.student_name} helperText={errors.student_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("award_name")} label="Name of the Award" size="small" fullWidth error={!!errors.award_name} helperText={errors.award_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("work_title")} label="Name of the Work for which Award is received" size="small" fullWidth error={!!errors.work_title} helperText={errors.work_title?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("date_received")} label="Date of Award Received" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.date_received} helperText={errors.date_received?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("awarding_organization")} label="Name of Awarding Organization" size="small" fullWidth error={!!errors.awarding_organization} helperText={errors.awarding_organization?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("award_amount")} label="Award Amount (INR) if any" type="number" size="small" fullWidth error={!!errors.award_amount} helperText={errors.award_amount?.message} inputProps={{ min: 0 }} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="award_level" control={control} render={({ field }) => (<FormControl fullWidth size="small"><InputLabel>Level of Award</InputLabel><Select {...field} label="Level of Award"><MenuItem value="University">University</MenuItem><MenuItem value="State">State</MenuItem><MenuItem value="National">National</MenuItem><MenuItem value="International">International</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}