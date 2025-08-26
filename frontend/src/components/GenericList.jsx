// src/components/GenericList.jsx

import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function GenericList({
  data,
  fields,
  mode,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);

  // --- FIX: ADDING DATA VALIDATION ---
  // This useEffect hook runs whenever the data changes and checks for key issues.
  useEffect(() => {
    if (!Array.isArray(data)) return;

    const ids = new Set();
    let hasLoggedError = false;

    data.forEach((item, index) => {
      // Check 1: Does the item have a null or undefined id?
      if (item.id === null || item.id === undefined) {
        console.error(
          `[GenericList Validation Error] Item at index ${index} is missing a unique 'id' property. This will cause React key warnings and potential bugs.`,
          item
        );
        hasLoggedError = true;
      }
      
      // Check 2: Is the id a duplicate?
      if (ids.has(item.id)) {
        console.error(
          `[GenericList Validation Error] Duplicate 'id' found: ${item.id}. React keys must be unique.`,
          item
        );
        hasLoggedError = true;
      }
      ids.add(item.id);
    });
    
    if (hasLoggedError) {
        console.error("[GenericList] Full data array with issues:", data);
    }
  }, [data]); // Dependency array ensures this runs only when data changes.


  const handleDeleteClick = (item) => {
    setTarget(item);
    setOpen(true);
  };

  const handleConfirm = () => {
    onDelete(target);
    setOpen(false);
    setTarget(null);
  };

  if (!Array.isArray(data)) {
    console.error("GenericList received non-array data:", data);
    return (
      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">Could not display data.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "background.paper" }}>
            <TableRow>
              {fields.map((f) => (
                <TableCell key={f.key || f.label} sx={{ fontWeight: "bold" }}>
                  {f.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow key="no-data-row">
                <TableCell colSpan={fields.length + 1} align="center">
                  <Typography sx={{ p: 2, color: 'text.secondary' }}>No entries found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                // Use the item.id as the key. The useEffect above will now warn you if the id is invalid.
                <TableRow key={item.id ?? `item-${index}`} hover>
                  {fields.map((f) => (
                    <TableCell key={`${item.id ?? index}-${f.key || f.label}`}>
                      {f.render ? f.render(item) : item[f.key] || ""}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {(mode === "view" || mode === "edit") && (
                      <IconButton size="small" onClick={() => onEdit(item)}><Edit fontSize="inherit" /></IconButton>
                    )}
                    {(mode === "view" || mode === "delete") && (
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(item)}><Delete fontSize="inherit" /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} BackdropProps={{ sx: { bgcolor: "rgba(0,0,0,0.1)" } }} PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 320 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>Are you sure you want to delete this entry? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}