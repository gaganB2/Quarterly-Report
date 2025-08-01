// src/components/FormTable.jsx
import React from "react"; // Removed unused useState and useEffect
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

// Updated to accept and use the 'filters' prop
export default function FormTable({ filters }) {
  const visibleSections = formSections;

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
              <TableCell>S. No.</TableCell>
              <TableCell>Form</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleSections.map((f, i) => (
              // Pass the filters prop down to each FormRow
              <FormRow key={f.code} form={f} idx={i} filters={filters} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}