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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function GenericList({
  data,
  fields,    // array of { label, key, render? }
  mode,      // "view" | "edit" | "delete"
  onEdit,
  onDelete,
}) {
  // Dialog state
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

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
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
            {data.map((item) => (
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
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Confirmation Dialog */}
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
          Are you sure you want to delete <strong>“{target?.title}”</strong>?
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
