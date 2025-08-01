// src/components/GenericList.jsx
import React, { useState } from "react";
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
  Typography, // Import Typography for the empty state message
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

  const handleDeleteClick = (item) => {
    setTarget(item);
    setOpen(true);
  };

  const handleConfirm = () => {
    onDelete(target);
    setOpen(false);
    setTarget(null);
  };

  // --- ADD THIS ROBUSTNESS CHECK ---
  // If data is not an array, don't try to render the table.
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
              {fields.map((f, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {f.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} align="center">
                  <Typography sx={{ p: 2, color: 'text.secondary' }}>No entries found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} hover>
                  {fields.map((f, i) => (
                    <TableCell key={i}>
                      {f.render ? f.render(item) : item[f.key] || ""}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {(mode === "view" || mode === "edit") && (
                      <IconButton size="small" onClick={() => onEdit(item)}>
                        <Edit fontSize="inherit" />
                      </IconButton>
                    )}
                    {(mode === "view" || mode === "delete") && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{ sx: { bgcolor: "rgba(0,0,0,0.1)" } }}
        PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 320 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          Are you sure you want to delete this entry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
