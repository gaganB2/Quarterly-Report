// src/components/FormTable.jsx

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

import { formSections } from "../config/formConfig";
import FormRow from "./FormRow";

// FIX: The component now accepts a `visibleSections` prop.
export default function FormTable({ filters, formCounts, countsLoading, visibleSections: visibleSectionsProp }) {
  // Use the passed-in sections if they exist, otherwise default to all sections.
  const visibleSections = visibleSectionsProp || formSections;
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleActive = (formCode) => {
    setActiveForm(prev => (prev === formCode ? null : formCode));
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Submission Sections
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ pl: 3.5 }}>S. No.</TableCell>
              <TableCell>Form</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
