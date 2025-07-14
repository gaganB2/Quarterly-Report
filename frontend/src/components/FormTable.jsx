// src/components/FormTable.jsx
import React from "react";
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
// import { formSections } from "../config/formConfig";
import { formSections, formConfig } from "../config/formConfig";
import FormRow from "./FormRow";

export default function FormTable({ session, year }) {
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
            {formSections.map((f, i) => (
              <FormRow
                key={f.code}
                form={f}
                idx={i}
                session={session}
                year={year}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
