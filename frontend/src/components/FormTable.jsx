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
} from "@mui/material";
import { formSections } from "../config/formConfig";
import FormRow from "./FormRow";

export default function FormTable({ filters, formCounts, countsLoading, visibleSections: visibleSectionsProp }) {
  const visibleSections = visibleSectionsProp || formSections;
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleActive = (formCode) => {
    setActiveForm(prev => (prev === formCode ? null : formCode));
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}> 
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Submission Sections
      </Typography>
      
      <TableContainer>
        <Table>
          {/* --- FIX: The stray comment that caused the warning has been removed from here. --- */}
          <TableHead sx={{ backgroundColor: "transparent" }}>
            <TableRow>
              <TableCell sx={{ pl: 3.5, fontWeight: 'bold' }}>S. No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Form</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Options</TableCell>
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
    </Paper>
  );
}