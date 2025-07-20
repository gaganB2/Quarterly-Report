// src/components/FormTable.jsx

import React, { useState, useEffect } from "react";
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

export default function FormTable() {
  const visibleSections = formSections;
  const [gen, setGen] = useState(0);

  useEffect(() => {
    // trigger initial loads
    setGen((g) => g + 1);
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Submission Sections
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Allow outer scrolling, not inner */}
      <Box
        sx={{
          width: "100%",
          overflowX: "visible",
          overflowY: "visible",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            // override MUI default auto‐scroll
            overflowX: "visible !important",
            overflowY: "visible !important",
          }}
        >
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
                <FormRow key={f.code} form={f} idx={i} autoViewGen={gen} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
