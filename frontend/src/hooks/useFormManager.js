// src/hooks/useFormManager.js

import { useState, useEffect } from "react";
import apiClient from "../api/axios";

/**
 * A custom hook to manage form state, submission, and feedback for all T-forms.
 * @param {object} params
 * @param {string} params.endpoint - The base API endpoint for the form (e.g., "/api/faculty/t1research/").
 * @param {object} params.initialState - The initial state object for the form's fields.
 * @param {object} params.editData - The data for the item being edited, if any.
 * @param {function} params.onSuccess - The callback function to execute after a successful submission.
 * @param {string} params.session - The initial quarter value.
 * @param {number} params.year - The initial year value.
 * @returns {object} - The state and handlers to be used by the form component.
 */
export const useFormManager = ({
  endpoint,
  initialState,
  editData,
  onSuccess,
  session,
  year,
}) => {
  const isEditMode = Boolean(editData?.id);

  // Unified state for all form fields, including quarter and year
  const [formData, setFormData] = useState({
    ...initialState,
    quarter: session || "Q1",
    year: year || new Date().getFullYear(),
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Effect to pre-fill form data when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      // Separate quarter/year from the rest of the fields
      const { quarter, year, ...rest } = editData;
      
      // Create a new state object ensuring all keys from initialState are present
      const populatedState = { ...initialState };
      for (const key in rest) {
        if (key in populatedState) {
          populatedState[key] = rest[key] || initialState[key];
        }
      }

      setFormData({
        ...populatedState,
        quarter: quarter,
        year: year,
      });
    }
  }, [editData, isEditMode, initialState]);

  // Generic handler for all input changes (text, select, checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generic handler for form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // The endpoint already includes the base path
    const url = isEditMode ? `${endpoint}${editData.id}/` : endpoint;
    const method = isEditMode ? "put" : "post";

    try {
      await apiClient[method](url, formData);
      setSnackbar({
        open: true,
        message: `Entry ${isEditMode ? "updated" : "submitted"} successfully!`,
        severity: "success",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err.response?.data);

      let msg = "Submission failed. Please check the fields.";
      const data = err.response?.data;

      // Build a user-friendly error message from the API response
      if (data && typeof data === "object") {
        msg = Object.entries(data)
          .map(([field, errors]) => {
            const errorText = Array.isArray(errors) ? errors.join(" ") : errors;
            return `${field}: ${errorText}`;
          })
          .join(" | ");
      } else if (Array.isArray(data)) {
        msg = data.join(" ");
      }

      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }));
  };

  return {
    isEditMode,
    formData,
    setFormData, // Exposing this for fields like quarter/year that have dedicated controls
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  };
};