// src/components/T5_2Form.jsx

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
  principal_investigator: z.string().min(1, "Principal Investigator is required"),
  co_principal_investigator: z.string().optional(),
  members: z.string().optional(),
  funding_agency: z.string().min(1, "Funding Agency is required"),
  project_title: z.string().min(1, "Project Title is required"),
  sanctioned_order_no: z.string().min(1, "Sanctioned Order No. is required"),
  sanctioned_date: z.string().min(1, "Sanctioned Date is required"),
  status: z.string(),
  completion_date: z.string().optional(),
  sanctioned_amount_lakhs: z.coerce.number().min(0, "Amount must be zero or positive"),
  amount_received_rupees: z.coerce.number().min(0, "Amount must be zero or positive"),
  duration: z.string(),
  regionality: z.string(),
  proof_link: z.string().url("Please enter a valid URL").min(1, "Proof link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
}).refine(data => {
    if (data.status === "Completed") {
        return !!data.completion_date;
    }
    return true;
}, {
    message: "Completion date is required if status is 'Completed'",
    path: ["completion_date"],
});

// Add default quarter and year to the initialState
const initialState = {
  principal_investigator: "", co_principal_investigator: "", members: "",
  funding_agency: "", project_title: "", sanctioned_order_no: "",
  sanctioned_date: "", status: "Ongoing", completion_date: "",
  sanctioned_amount_lakhs: 0, amount_received_rupees: 0,
  duration: "Short-Term", regionality: "Regional", proof_link: "",
  quarter: "", year: "",
};

export default function T5_2Form({ session, year, editData, onSuccess }) {
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
      const endpoint = formConfig["T5.2"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, data);
      enqueueSnackbar(`Sponsored project ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar("Submission failed. Please check the fields and try again.", { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit Sponsored Project (T5.2)" : "Add Sponsored Project (T5.2)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Session & Year */}
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>

            {/* Form Fields */}
            <Grid item xs={12}><TextField {...register("project_title")} label="Title of the Project" size="small" fullWidth error={!!errors.project_title} helperText={errors.project_title?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("principal_investigator")} label="Principal Investigator (PI)" size="small" fullWidth error={!!errors.principal_investigator} helperText={errors.principal_investigator?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("co_principal_investigator")} label="Co-Principal Investigator (Co-PI)" size="small" fullWidth /></Grid>
            <Grid item xs={12}><TextField {...register("members")} label="Other members (if any)" size="small" multiline rows={2} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("funding_agency")} label="Name of the Funding Agency" size="small" fullWidth error={!!errors.funding_agency} helperText={errors.funding_agency?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("sanctioned_order_no")} label="Sanctioned Order No." size="small" fullWidth error={!!errors.sanctioned_order_no} helperText={errors.sanctioned_order_no?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("sanctioned_date")} label="Sanctioned Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.sanctioned_date} helperText={errors.sanctioned_date?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("completion_date")} label="Completion Date (if applicable)" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.completion_date} helperText={errors.completion_date?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("sanctioned_amount_lakhs")} label="Sanctioned Amount (In Lakhs)" type="number" size="small" fullWidth error={!!errors.sanctioned_amount_lakhs} helperText={errors.sanctioned_amount_lakhs?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("amount_received_rupees")} label="Amount Received (In Rupees)" type="number" size="small" fullWidth error={!!errors.amount_received_rupees} helperText={errors.amount_received_rupees?.message} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="status" control={control} render={({ field }) => ( <FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select {...field} label="Status"><MenuItem value="Ongoing">Ongoing</MenuItem><MenuItem value="Completed">Completed</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={4}><Controller name="duration" control={control} render={({ field }) => ( <FormControl fullWidth size="small"><InputLabel>Duration</InputLabel><Select {...field} label="Duration"><MenuItem value="Short-Term">Short-Term</MenuItem><MenuItem value="Medium-Term">Medium-Term</MenuItem><MenuItem value="Long-Term">Long-Term</MenuItem><MenuItem value="Other">Other</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={4}><Controller name="regionality" control={control} render={({ field }) => ( <FormControl fullWidth size="small"><InputLabel>Regionality</InputLabel><Select {...field} label="Regionality"><MenuItem value="Regional">Regional</MenuItem><MenuItem value="National">National</MenuItem><MenuItem value="International">International</MenuItem></Select></FormControl>)}/></Grid>
            <Grid item xs={12}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update Entry" : "Submit Entry"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}