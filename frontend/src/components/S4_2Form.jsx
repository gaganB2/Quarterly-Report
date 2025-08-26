// src/components/S4_2Form.jsx

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
  batch: z.string().min(1, "Batch is required"),
  company_name: z.string().min(1, "Company name is required"),
  package_offered: z.coerce.number().min(0, "Package must be a positive number"),
  offer_ref_number: z.string().min(1, "Offer reference number is required"),
  contact_details: z.string().min(1, "Contact details are required"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  social_profile_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  proof_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  student_name: "", batch: "", company_name: "", package_offered: 0,
  offer_ref_number: "", contact_details: "", email: "", mobile: "",
  social_profile_link: "", proof_link: "",
  quarter: "", year: "",
};

export default function S4_2Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["S4.2"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Campus recruitment entry ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
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
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Campus Recruitment (S4.2)" : "Add Campus Recruitment (S4.2)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields from Model */}
            <Grid item xs={12} sm={6}><TextField {...register("student_name")} label="Name of The Student" size="small" fullWidth error={!!errors.student_name} helperText={errors.student_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("batch")} label="Batch" size="small" fullWidth error={!!errors.batch} helperText={errors.batch?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("company_name")} label="Name of the Company Joined" size="small" fullWidth error={!!errors.company_name} helperText={errors.company_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("package_offered")} label="Package offered" type="number" size="small" fullWidth error={!!errors.package_offered} helperText={errors.package_offered?.message} inputProps={{ min: 0 }} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("offer_ref_number")} label="Offer Letter Reference Number" size="small" fullWidth error={!!errors.offer_ref_number} helperText={errors.offer_ref_number?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("contact_details")} label="Contact Details of Student" size="small" fullWidth error={!!errors.contact_details} helperText={errors.contact_details?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("email")} label="E-mail ID" type="email" size="small" fullWidth error={!!errors.email} helperText={errors.email?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("mobile")} label="Mobile No." size="small" fullWidth error={!!errors.mobile} helperText={errors.mobile?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("social_profile_link")} label="Profile in Social Sites (Facebook, LinkedIn, etc.)" size="small" fullWidth error={!!errors.social_profile_link} helperText={errors.social_profile_link?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}