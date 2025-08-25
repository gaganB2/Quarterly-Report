// src/hooks/useFormManager.js

import { useState, useEffect } from "react";
import apiClient from "../api/axios";

/**
 * A custom hook to manage form state, submission, and feedback for all report forms.
 * @param {object} params
 * @param {string} params.endpoint - The base API endpoint for the form.
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
      // FIX: This is the corrected, robust logic for pre-filling the form.
      // It correctly spreads the initial state to ensure all fields are present,
      // then spreads the editData over it to pre-fill the form with saved values.
      setFormData({
        ...initialState,
        ...editData,
      });
    }
  }, [editData, isEditMode, initialState]);

  // Generic handler for all input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generic handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

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

      if (data && typeof data === "object") {
        msg = Object.entries(data)
          .map(([field, errors]) => {
            const errorText = Array.isArray(errors) ? errors.join(" ") : errors;
            return `${field.replace(/_/g, " ")}: ${errorText}`;
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
    setFormData,
    submitting,
    snackbar,
    handleChange,
    handleSubmit,
    closeSnackbar,
  };
};
