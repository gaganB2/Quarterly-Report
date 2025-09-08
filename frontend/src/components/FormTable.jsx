// src/components/FormTable.jsx

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack
} from "@mui/material";
import { formSections } from "../config/formConfig";
import FormRow from "./FormRow";

export default function FormTable({ filters, formCounts, countsLoading, visibleSections: visibleSectionsProp, FilterPanel, refreshCounts }) {
  const visibleSections = visibleSectionsProp || formSections;
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleActive = (formCode) => {
    setActiveForm(prev => (prev === formCode ? null : formCode));
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'transparent', boxShadow: 'none' }}> 
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Submission Sections
        </Typography>
        
        {FilterPanel}
      </Stack>
      
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={0}>
        {visibleSections.map((f, i) => {
          const isActive = activeForm === f.code;
          const count = formCounts[f.code] ?? null;

          return (
            <FormRow
              key={f.code}
              form={f}
              idx={i}
              filters={filters}
              isActive={isActive}
              onToggleActive={handleToggleActive}
              count={count}
              isLoadingCount={countsLoading}
              refreshCounts={refreshCounts}
            />
          );
        })}
      </Stack>
    </Paper>
  );
}