// src/components/FormRow.jsx
import React, { useState, useEffect } from "react";
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

const PREVIEW_COLUMN_LIMIT = 5;

export default function FormRow({ form, idx, filters }) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("add");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [fullOpen, setFullOpen] = useState(false);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) return null;

  const loadData = async () => {
    // Convert the filters object into a URL query string.
    // This will ignore any filter values that are empty.
    const params = new URLSearchParams(filters).toString();
    const url = `${cfg.endpoint}?${params}`;

    try {
      const res = await apiClient.get(url);
      setData(res.data.results || []);
    } catch (error) {
      console.error(`Failed to load data for ${form.code}:`, error);
      setData([]);
    }
  };

  // This effect re-fetches data whenever the filters change,
  // but only if the panel is already open in a view mode.
  useEffect(() => {
    if (expanded && (mode === 'view' || mode === 'edit' || mode === 'delete')) {
      loadData();
    }
  }, [filters]); // The dependency array ensures this runs when filters change

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

  const handleEditItem = (item) => {
    setEditData(item);
    setMode("edit");
    setExpanded(true);
  };

  const handleDeleteItem = async (item) => {
    await apiClient.delete(`${cfg.endpoint}${item.id}/`);
    await loadData(); // Refresh data with current filters
  };

  const handleSuccess = () => {
    setExpanded(false);
    // After adding/editing, reload the data with the current filters applied
    loadData();
  };

  const renderPanel = () => {
    if (mode === "add") {
      return <GenericForm FormComponent={cfg.FormComponent} onSuccess={handleSuccess} />;
    }
    if (mode === "view" || mode === "edit" || mode === "delete") {
      const previewFields = (cfg.listFields || []).slice(0, PREVIEW_COLUMN_LIMIT);
      return (
        <>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button variant="outlined" size="small" onClick={() => setFullOpen(true)}>
              View Full Table
            </Button>
          </Box>
          <GenericList
            data={data}
            fields={previewFields}
            mode={mode}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
          {mode === "edit" && editData && (
            <Box mt={2}>
              <GenericForm
                FormComponent={cfg.FormComponent}
                editData={editData}
                onSuccess={handleSuccess}
              />
            </Box>
          )}
        </>
      );
    }
    return null;
  };

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

      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box m={2}>{renderPanel()}</Box>
            <Divider />
          </Collapse>
        </TableCell>
      </TableRow>

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