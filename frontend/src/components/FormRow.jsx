import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Button,
  Collapse,
  Box,
  Divider,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";

export default function FormRow({ form, idx }) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "view" | "edit" | "delete"
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [fullOpen, setFullOpen] = useState(false);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) return null;

  // Load all entries for this section
  const loadData = async () => {
    const res = await apiClient.get(cfg.endpoint);
    setData(res.data);
  };

  // Toggle panel open/close for any mode
  const handleOpen = async (newMode) => {
    if (expanded && mode === newMode) {
      setExpanded(false);
      return;
    }
    setMode(newMode);
    setEditData(null);
    if (newMode !== "add") {
      await loadData();
    }
    setExpanded(true);
  };

  // Edit icon clicked in list
  const handleEditItem = (item) => {
    setEditData(item);
    setMode("edit");
    setExpanded(true);
  };

  // Delete icon clicked in list
  const handleDeleteItem = async (item) => {
    await apiClient.delete(`${cfg.endpoint}${item.id}/`);
    await loadData();
  };

  // Render the main panel
  const renderPanel = () => {
    if (mode === "add") {
      return <GenericForm FormComponent={cfg.FormComponent} onSuccess={() => setExpanded(false)} />;
    }
    // view/edit/delete all show the list first
    if (mode === "view" || mode === "edit" || mode === "delete") {
      return (
        <>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button variant="outlined" size="small" onClick={() => setFullOpen(true)}>
              View Full Table
            </Button>
          </Box>
          <GenericList
            data={data}
            fields={cfg.listFields || []}
            mode={mode}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
          {mode === "edit" && editData && (
            <Box mt={2}>
              <GenericForm
                FormComponent={cfg.FormComponent}
                editData={editData}
                onSuccess={() => setExpanded(false)}
              />
            </Box>
          )}
        </>
      );
    }
    return null;
  };

  // Header buttons
  const renderButton = (btnMode, label, color = "primary") => {
    const active = mode === btnMode && expanded;
    return (
      <Button
        size="small"
        onClick={() => handleOpen(btnMode)}
        sx={{ mr: 1, minWidth: 60 }}
        variant={active ? "contained" : "text"}
        color={active ? color : "inherit"}
      >
        {expanded && mode === btnMode ? "Close" : label}
      </Button>
    );
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{idx + 1}</TableCell>
        <TableCell>
          <strong>{form.code}</strong> — {form.title}
        </TableCell>
        <TableCell align="right">
          {renderButton("add", "Add", "success")}
          {renderButton("view", "View")}
          {renderButton("edit", "Edit", "warning")}
          {renderButton("delete", "Delete", "error")}
        </TableCell>
      </TableRow>

      {/* Expandable panel */}
      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box m={2}>{renderPanel()}</Box>
            <Divider />
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Full-screen dialog for “View Full Table” */}
      <Dialog fullScreen open={fullOpen} onClose={() => setFullOpen(false)}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setFullOpen(false)}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              {form.code} — Full Table
            </Typography>
          </Toolbar>
        </AppBar>
        <Box p={2}>
          <GenericList
            data={data}
            fields={cfg.listFields || []}
            mode="view"
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </Box>
      </Dialog>
    </>
  );
}
