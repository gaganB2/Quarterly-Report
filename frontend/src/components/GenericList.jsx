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
  alpha,
  useTheme,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function GenericList({ data, fields, mode, onEdit, onDelete }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => { /* Data validation logic */ }, [data]);

  const handleDeleteClick = (item) => { setTarget(item); setOpen(true); };
  const handleConfirm = () => { onDelete(target); setOpen(false); setTarget(null); };

  if (!Array.isArray(data)) {
    return (<Paper sx={{ p: 2, textAlign: 'center' }}><Typography color="error">Could not display data.</Typography></Paper>);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <TableHead>
            <TableRow>
              {fields.map((f) => (
                <TableCell key={f.key || f.label} sx={{ 
                  fontWeight: 600, 
                  py: 1.5, 
                  px: 2,
                  backgroundColor: alpha(theme.palette.action.selected, 0.05),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'text.primary',
                }}>
                  {f.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, py: 1.5, px: 2, backgroundColor: alpha(theme.palette.action.selected, 0.05), borderBottom: `1px solid ${theme.palette.divider}`, color: 'text.primary' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} align="center">
                  <Typography sx={{ p: 4, color: 'text.secondary' }}>No entries found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow 
                  key={item.id ?? `item-${index}`} 
                  hover 
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.04),
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {fields.map((f) => (
                    <TableCell key={`${item.id ?? index}-${f.key || f.label}`} sx={{ py: 1.5, px: 2, verticalAlign: 'top', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {f.render ? f.render(item) : item[f.key] || ""}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ py: 1.5, px: 2, verticalAlign: 'top', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {(mode === "view" || mode === "edit") && (<IconButton size="small" onClick={() => onEdit(item)}><Edit fontSize="inherit" /></IconButton>)}
                    {(mode === "view" || mode === "delete") && (<IconButton size="small" color="error" onClick={() => handleDeleteClick(item)}><Delete fontSize="inherit" /></IconButton>)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 320 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this entry? This action cannot be undone.</Typography></DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}