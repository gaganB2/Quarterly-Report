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

// +++ Update component to accept formCounts and countsLoading props +++
export default function FormTable({ filters, formCounts, countsLoading }) {
  const visibleSections = formSections;
  const [expandedRows, setExpandedRows] = useState([]);

  const handleToggleActive = (formCode) => {
    setExpandedRows((prevExpanded) => {
      const isCurrentlyExpanded = prevExpanded.includes(formCode);
      if (isCurrentlyExpanded) {
        return prevExpanded.filter((code) => code !== formCode);
      } else {
        return [...prevExpanded, formCode];
      }
    });
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
              const isActive = expandedRows.includes(f.code);
              // +++ Get the count for this specific form from the formCounts object +++
              // Default to null if not found.
              const count = formCounts[f.code] ?? null;

              return (
                <FormRow
                  key={f.code}
                  form={f}
                  idx={i}
                  filters={filters}
                  isActive={isActive}
                  onToggleActive={handleToggleActive}
                  // +++ Pass the count and loading state down to the FormRow +++
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