// src/components/FormTable.jsx
import React, { useState, useEffect } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

import { formSections } from "../config/formConfig";
import FormRow from "./FormRow";

export default function FormTable({ filters }) {
  // Show all sections if no form filter, otherwise only the one chosen
  const visibleSections = formSections.filter(
    (s) => !filters.form || s.code === filters.form
  );

  const [gen, setGen] = useState(0);
  useEffect(() => {
    // bump whenever filters change
    setGen((g) => g + 1);
  }, [filters]);

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Submission Sections
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>S. No.</TableCell>
              <TableCell>Form</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleSections.map((f, i) => (
              <FormRow
                key={f.code}
                form={f}
                idx={i}
                filters={filters}
                autoViewGen={gen}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
