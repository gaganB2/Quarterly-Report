// src/hooks/useFormManager.js

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";

export const useFormManager = ({
  endpoint,
  initialState,
  editData,
  onSuccess,
  session,
  year,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  
  // This value is derived directly from props for use in the return statement.
  const isEditMode = Boolean(editData?.id);

  // Memoize the base form state to prevent re-computation on every render.
  const initialFormState = useMemo(() => ({
    ...initialState,
    quarter: session || "Q1",
    year: year || new Date().getFullYear(),
  }), [initialState, session, year]);

  // FIX: Always initialize the form as blank. The useEffect below is the single
  // source of truth for populating or resetting the form based on props.
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // FIX: This useEffect is now the definitive source of truth for syncing props to state.
  useEffect(() => {
    console.log('[useFormManager] Syncing state. Has editData:', !!editData);
    if (isEditMode && editData) {
      // If we are in edit mode, populate the form with the provided data.
      console.log('[useFormManager] Populating form for EDIT mode with:', editData);
      setFormData({ ...initialFormState, ...editData });
    } else {
      // If we are in add mode (or editData was cleared), reset to the initial blank state.
      console.log('[useFormManager] Resetting form for ADD mode.');
      setFormData(initialFormState);
    }
  }, [editData, initialFormState, isEditMode]); // Effect runs when editData changes.


  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
    const method = isEditMode ? "put" : "post";
    console.log(`[useFormManager] Submitting form. Method: ${method.toUpperCase()}, URL: ${url}`);

    try {
      await apiClient[method](url, formData);
      const successMessage = `Entry ${isEditMode ? "updated" : "submitted"} successfully!`;
      enqueueSnackbar(successMessage, { variant: "success" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("[useFormManager] Form submission error:", err.response || err);
      let msg = "Submission failed. Please check the fields and try again.";
      const data = err.response?.data;
      if (data) {
        if (data.non_field_errors) {
          msg = data.non_field_errors.join(" ");
        } else if (data.detail) {
          msg = data.detail;
        } else if (typeof data === "object") {
          msg = Object.entries(data)
            .map(([field, errors]) => {
              const errorText = Array.isArray(errors) ? errors.join(" ") : String(errors);
              return `${field.replace(/_/g, " ")}: ${errorText}`;
            })
            .join(" | ");
        }
      }
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [endpoint, formData, isEditMode, editData?.id, onSuccess, enqueueSnackbar]);

  return {
    isEditMode,
    formData,
    setFormData,
    submitting,
    handleChange,
    handleSubmit,
  };
};