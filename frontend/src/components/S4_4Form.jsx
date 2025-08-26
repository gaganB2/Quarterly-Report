// src/components/S4_4Form.jsx

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
  Divider,
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
  student_roll_no: z.string().min(1, "Roll number is required"),
  student_name: z.string().min(1, "Student name is required"),
  photo_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  placement_type: z.string().optional(),
  organization_name: z.string().optional(),
  package_offered: z.coerce.number().min(0).optional(),
  program_name: z.string().optional(),
  institution_joined: z.string().optional(),
  admission_year: z.coerce.number().min(1900).optional(),
  entrepreneurship: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  contact_details: z.string().min(1, "Contact details are required"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  offer_ref_number: z.string().optional(),
  social_profile_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  proof_link: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
});

// Add default quarter and year to the initialState
const initialState = {
  student_roll_no: "", student_name: "", photo_link: "", placement_type: "Software",
  organization_name: "", package_offered: 0, program_name: "", institution_joined: "",
  admission_year: new Date().getFullYear(), entrepreneurship: "", email: "",
  contact_details: "", mobile: "", offer_ref_number: "", social_profile_link: "", proof_link: "",
  quarter: "", year: "",
};

export default function S4_4Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["S4.4"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Entry ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
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
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Placement/Higher Studies (S4.4)" : "Add Placement/Higher Studies (S4.4)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => (<FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* --- Name Of The Student --- */}
            <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Student Details</Typography></Divider></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("student_roll_no")} label="Roll No." size="small" fullWidth error={!!errors.student_roll_no} helperText={errors.student_roll_no?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("student_name")} label="Name" size="small" fullWidth error={!!errors.student_name} helperText={errors.student_name?.message} /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("photo_link")} label="Photo URL" size="small" fullWidth error={!!errors.photo_link} helperText={errors.photo_link?.message} /></Grid>
            
            {/* --- Placement Details --- */}
            <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Placement Details</Typography></Divider></Grid>
            <Grid item xs={12} sm={4}><Controller name="placement_type" control={control} render={({ field }) => (<FormControl fullWidth size="small"><InputLabel>Type</InputLabel><Select {...field} label="Type"><MenuItem value="Software">Software</MenuItem><MenuItem value="Core">Core</MenuItem><MenuItem value="PSU">PSU</MenuItem><MenuItem value="Other">Other</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("organization_name")} label="Name of Organization" size="small" fullWidth /></Grid>
            <Grid item xs={12} sm={4}><TextField {...register("package_offered")} label="Package" type="number" size="small" fullWidth inputProps={{ min: 0 }} /></Grid>

            {/* --- Higher Studies Details --- */}
            <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Higher Studies Details</Typography></Divider></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("program_name")} label="Name of the Programme" size="small" fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("institution_joined")} label="Name of the Institution Joined" size="small" fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("admission_year")} label="Year of Admission" type="number" size="small" fullWidth inputProps={{ min: 1900 }} /></Grid>
            
            {/* --- Entrepreneurship & Contact --- */}
            <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Entrepreneurship & Contact</Typography></Divider></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("entrepreneurship")} label="Entrepreneurship (Name of Company)" size="small" fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("contact_details")} label="Contact Details" size="small" fullWidth error={!!errors.contact_details} helperText={errors.contact_details?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("email")} label="E-mail ID" type="email" size="small" fullWidth error={!!errors.email} helperText={errors.email?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("mobile")} label="Mobile No." size="small" fullWidth error={!!errors.mobile} helperText={errors.mobile?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("social_profile_link")} label="Profile in Social Sites" size="small" fullWidth error={!!errors.social_profile_link} helperText={errors.social_profile_link?.message} /></Grid>
            
            {/* --- Proofs --- */}
            <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Proofs</Typography></Divider></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("offer_ref_number")} label="Reference Number of Joining Letter" size="small" fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}