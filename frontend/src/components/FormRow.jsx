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
  Chip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
// +++ THIS IS THE CORRECTED IMPORT PATH +++
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";

const PREVIEW_COLUMN_LIMIT = 5;

// Helper component to display filters (Unchanged)
const FilterDisplay = ({ filters }) => {
  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
    }));

  if (activeFilters.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>Active Filters:</Typography>
      {activeFilters.map(f => (
        <Chip key={f.label} label={`${f.label}: ${f.value}`} size="small" />
      ))}
    </Box>
  );
};

export default function FormRow({ form, idx, filters, isActive, onToggleActive, count, isLoadingCount }) {
  const theme = useTheme();
  const [mode, setMode] = useState("add");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [fullOpen, setFullOpen] = useState(false);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) return null;

  const loadData = async () => {
    const params = new URLSearchParams(filters).toString();
    const url = `${cfg.endpoint}?${params}`;
    try {
      const res = await apiClient.get(url);
      setData(res.data.results || []);
    } catch (error)
    {
      console.error(`Failed to load data for ${form.code}:`, error);
      setData([]);
    }
  };

  useEffect(() => {
    if (isActive && (mode === 'view' || mode === 'edit' || mode === 'delete')) {
      loadData();
    }
  }, [filters, isActive, mode]);

  const handleOpen = (newMode) => {
    setMode(newMode);
    setEditData(null);
    if (newMode !== "add") {
      loadData();
    }
    onToggleActive(form.code);
  };
  
  const handleEditItem = (item) => {
    setEditData(item);
    setMode("edit");
  };

  const handleDeleteItem = async (item) => {
    await apiClient.delete(`${cfg.endpoint}${item.id}/`);
    await loadData();
  };

  const handleSuccess = () => {
    onToggleActive(form.code);
  };

  const renderPanel = () => {
    if (mode === "add") {
      return <GenericForm FormComponent={cfg.FormComponent} onSuccess={handleSuccess} />;
    }
    if (mode === "view" || mode === "edit" || mode === "delete") {
      const previewFields = (cfg.listFields || []).slice(0, PREVIEW_COLUMN_LIMIT);
      return (
        <>
          <FilterDisplay filters={filters} />
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
    const active = isActive && mode === btnMode;
    return (
      <Button
        size="small"
        onClick={() => handleOpen(btnMode)}
        sx={{ mr: 1, minWidth: 60 }}
        variant={active ? "contained" : "text"}
        color={active ? color : "inherit"}
      >
        {active ? "Collapse" : label}
      </Button>
    );
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          borderLeft: `4px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
          transition: 'border-left 0.2s ease-in-out, background-color 0.2s ease-in-out',
        }}
      >
        <TableCell>{idx + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" component="span" sx={{ flexGrow: 1 }}>
              <strong>{form.code}</strong> — {form.title}
            </Typography>
            
            {isLoadingCount ? (
              <CircularProgress size={18} thickness={5} />
            ) : (
              count !== null && (
                <Chip
                  label={count}
                  size="small"
                  color={count > 0 ? "primary" : "default"}
                  variant={count > 0 ? "filled" : "outlined"}
                />
              )
            )}
          </Box>
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
          <Collapse in={isActive} timeout="auto" unmountOnExit>
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
            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
              {form.code} — Full Table
            </Typography>
          </Toolbar>
        </AppBar>
        <Box p={3}>
          <FilterDisplay filters={filters} />
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