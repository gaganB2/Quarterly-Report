// src/components/T6_5Form.jsx

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

const formSchema = z.object({
  faculty_name: z.string().min(1, "Faculty name is required"),
  initiative_name: z.string().min(1, "Initiative name is required"),
  date: z.string().min(1, "Date is required"),
  role: z.string().min(1, "Role is required"),
  organizing_institute: z.string().min(1, "Organizing institute is required"),
  proof_link: z.string().url("Please enter a valid URL").min(1, "Proof link is required"),
  quarter: z.string().min(1, "Quarter is required"),
  year: z.number({ required_error: "Year is required" }),
  role_dropdown: z.string(),
});

// Add default quarter and year to the initialState
const initialState = {
  faculty_name: "", initiative_name: "", date: "", role: "Participant",
  organizing_institute: "", proof_link: "", role_dropdown: "Participant",
  quarter: "", year: "",
};

const STANDARD_ROLES = ["Coordinator", "Member", "Participant"];

export default function T6_5Form({ session, year, editData, onSuccess }) {
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

  const roleDropdownValue = useWatch({ control, name: "role_dropdown" });
  const showOtherRoleField = roleDropdownValue === "Other";

  // Simplified effect to handle prop changes
  useEffect(() => {
    let defaultValues;
    if (isEditMode && editData) {
        const isStandardRole = STANDARD_ROLES.includes(editData.role);
        defaultValues = {
            ...initialState,
            ...editData,
            role_dropdown: isStandardRole ? editData.role : "Other",
        };
    } else {
        defaultValues = { ...initialState, quarter: session, year: parseInt(year, 10) || new Date().getFullYear() };
    }
    reset(defaultValues);
  }, [editData, isEditMode, session, year, reset]);

  // Handle the form submission
  const onFormSubmit = async (data) => {
    const { role_dropdown, ...submissionData } = data;
    try {
      const endpoint = formConfig["T6.5"].endpoint;
      const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
      const method = isEditMode ? "put" : "post";
      await apiClient[method](url, submissionData);
      enqueueSnackbar(`AICTE initiative ${isEditMode ? "updated" : "added"} successfully!`, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      enqueueSnackbar("Submission failed. Please check the fields and try again.", { variant: "error" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{isEditMode ? "Edit AICTE Initiative (T6.5)" : "Add AICTE Initiative (T6.5)"}</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Controller name="quarter" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.quarter}><InputLabel>Quarter</InputLabel><Select {...field} label="Quarter">{QUARTER_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="year" control={control} render={({ field }) => ( <FormControl fullWidth size="small" error={!!errors.year}><InputLabel>Year</InputLabel><Select {...field} label="Year">{YEAR_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}</Select></FormControl>)}/></Grid>
            <Grid item xs={12}><TextField {...register("faculty_name")} label="Name of Faculty" size="small" fullWidth error={!!errors.faculty_name} helperText={errors.faculty_name?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("initiative_name")} label="Name of the AICTE Initiative" size="small" multiline rows={3} fullWidth error={!!errors.initiative_name} helperText={errors.initiative_name?.message || "e.g., Clean & Smart Campus, Yoga, etc."} /></Grid>
            <Grid item xs={12} sm={6}><TextField {...register("date")} label="Date" type="date" InputLabelProps={{ shrink: true }} size="small" fullWidth error={!!errors.date} helperText={errors.date?.message} /></Grid>
            <Grid item xs={12} sm={showOtherRoleField ? 3 : 6}>
              <Controller name="role_dropdown" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role" onChange={(e) => { const value = e.target.value; field.onChange(value); if (value !== "Other") { setValue("role", value); } else { setValue("role", ""); }}}>
                      {STANDARD_ROLES.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {showOtherRoleField && (<Grid item xs={12} sm={3}><TextField {...register("role")} label="Please specify role" size="small" fullWidth error={!!errors.role} helperText={errors.role?.message} /></Grid>)}
            <Grid item xs={12}><TextField {...register("organizing_institute")} label="Name of the Organizing Institute" size="small" fullWidth error={!!errors.organizing_institute} helperText={errors.organizing_institute?.message} /></Grid>
            <Grid item xs={12}><TextField {...register("proof_link")} label="Google Drive Link (Upload Proof)" size="small" fullWidth error={!!errors.proof_link} helperText={errors.proof_link?.message} /></Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}><Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : isEditMode ? "Update" : "Submit"}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
}