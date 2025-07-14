// src/components/GenericList.jsx
import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function GenericList({
  data,
  fields,    // array of { label, key?, render? }
  mode,      // "view" | "edit" | "delete"
  onEdit,
  onDelete,
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            {fields.map((f, i) => (
              <TableCell key={i} sx={{ fontWeight: 600 }}>
                {f.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {fields.map((f, i) => (
                <TableCell key={i}>
                  {f.render
                    ? f.render(item)
                    : item[f.key] ?? ""}
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
                    onClick={() => onDelete(item)}
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
  );
}
