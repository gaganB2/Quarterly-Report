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
// --- LINE REMOVED --- The 'motion' import from framer-motion is no longer needed here.

// --- BLOCK REMOVED --- The 'tableContainerVariants' object is removed as the animation logic is being moved to the child.

export default function FormTable({ filters, formCounts, countsLoading, visibleSections: visibleSectionsProp, FilterPanel }) {
  const visibleSections = visibleSectionsProp || formSections;
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleActive = (formCode) => {
    setActiveForm(prev => (prev === formCode ? null : formCode));
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}> 
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4" fontWeight={700}>
          Submission Sections
        </Typography>
        
        {FilterPanel}
      </Box>
      
      <Divider sx={{ mb: 1 }} />

      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "transparent" }}>
            <TableRow>
              <TableCell sx={{ width: '5%', pl: 3.5, fontWeight: 'bold' }}>S. No.</TableCell>
              <TableCell sx={{ width: '70%', fontWeight: 'bold' }}>Form</TableCell>
              <TableCell align="center" sx={{ width: '25%', fontWeight: 'bold', pr: 3.5 }}>Options</TableCell>
            </TableRow>
          </TableHead>
          
          {/* --- FIX: The <motion.tbody> has been replaced with a standard <tbody> --- */}
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