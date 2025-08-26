// src/components/FormRow.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  TableRow, TableCell, Button, Collapse, Box, Divider, Dialog, AppBar, Toolbar,
  IconButton, Typography, Chip, useTheme, CircularProgress, Alert, alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";

const PREVIEW_COLUMN_LIMIT = 5;

const getCurrentQuarter = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  if (month >= 6 && month <= 8) return { session: 'Q1', year };
  if (month >= 9 && month <= 11) return { session: 'Q2', year };
  if (month >= 0 && month <= 2) return { session: 'Q3', year };
  if (month >= 3 && month <= 5) return { session: 'Q4', year };
  return { session: 'Q1', year };
};

const FilterDisplay = ({ filters }) => {
  const activeFilters = Object.entries(filters).filter(([, value]) => value).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
  }));
  if (activeFilters.length === 0) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>Active Filters:</Typography>
      {activeFilters.map(f => (<Chip key={f.label} label={`${f.label}: ${f.value}`} size="small" />))}
    </Box>
  );
};

export default function FormRow({ form, idx, filters, isActive, onToggleActive, count, isLoadingCount }) {
  const theme = useTheme();
  const [mode, setMode] = useState("add");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) { return null; }

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams(filters).toString();
    const url = `${cfg.endpoint}?${params}`;
    try {
      const res = await apiClient.get(url);
      setData(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [form.code, cfg.endpoint, filters]);

  useEffect(() => {
    if (isActive && ['view', 'edit', 'delete'].includes(mode)) {
      loadData();
    }
    if (!isActive) {
      setData([]);
      setError(null);
      setEditData(null);
    }
  }, [isActive, mode, loadData]);

  const handleOpen = (newMode) => {
    setMode(newMode);
    setEditData(null);
    onToggleActive(form.code);
  };
  
  const handleEditItem = (item) => {
    setEditData(item);
    setMode("edit");
  };

  const handleDeleteItem = async (item) => {
    try {
      await apiClient.delete(`${cfg.endpoint}${item.id}/`);
      await loadData();
    } catch (err) {
       setError("Failed to delete the entry. Please try again.");
    }
  };

  const handleSuccess = () => { onToggleActive(form.code); };

  const renderPanelContent = () => {
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Could not load data: {error}</Alert>;

    const formSession = filters.session || getCurrentQuarter().session;
    const formYear = filters.year || getCurrentQuarter().year;

    if (mode === "add") {
      return (<GenericForm FormComponent={cfg.FormComponent} onSuccess={handleSuccess} session={formSession} year={formYear} />);
    }

    if (['view', 'edit', 'delete'].includes(mode)) {
      const previewFields = (cfg.listFields || []).slice(0, PREVIEW_COLUMN_LIMIT);
      return (
        <>
          <FilterDisplay filters={filters} />
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button variant="outlined" size="small" onClick={() => setFullOpen(true)}>View Full Table</Button>
          </Box>
          <GenericList data={data} fields={previewFields} mode={mode} onEdit={handleEditItem} onDelete={handleDeleteItem} />
          {mode === "edit" && editData && (
            <Box mt={3} p={2} border={1} borderColor="divider" borderRadius={2}>
              <Typography variant="h6" gutterBottom>Editing Entry #{editData.id}</Typography>
              <GenericForm FormComponent={cfg.FormComponent} editData={editData} onSuccess={handleSuccess} session={formSession} year={formYear} />
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
      <Button size="small" onClick={() => handleOpen(btnMode)} sx={{ mr: 1, minWidth: 60 }} variant={active ? "contained" : "text"} color={active ? color : "inherit"}>
        {active ? "Collapse" : label}
      </Button>
    );
  };

  return (
    <React.Fragment>
      <TableRow key={`${form.code}-data`} hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{idx + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" component="span" sx={{ flexGrow: 1 }}><strong>{form.code}</strong> — {form.title}</Typography>
            {isLoadingCount ? (<CircularProgress size={18} thickness={5} />) : (count !== null && (
                <Chip label={count} size="small" color={count > 0 ? "primary" : "default"} variant={count > 0 ? "filled" : "outlined"}/>
            ))}
          </Box>
        </TableCell>
        <TableCell align="right">
          {renderButton("add", "Add", "success")}
          {renderButton("view", "View")}
          {renderButton("edit", "Edit", "warning")}
          {renderButton("delete", "Delete", "error")}
        </TableCell>
      </TableRow>
      <TableRow key={`${form.code}-collapse`}>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <Collapse in={isActive} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1, p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.background.default, 0.7) }}>
              {renderPanelContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* --- THIS IS THE DEFINITIVE FIX --- */}
      <Dialog fullScreen open={fullOpen} onClose={() => setFullOpen(false)}>
        {/* The Dialog's Paper now has its own background gradient, providing contrast */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          backgroundImage: `linear-gradient(120deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
        }}>
          {/* The AppBar will now get its glass style from the theme and be clearly visible against the gradient */}
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => setFullOpen(false)}><CloseIcon /></IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>{form.code} — Full Table</Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
            <FilterDisplay filters={filters} />
            {/* GenericList renders its own Paper, which will have the glass effect */}
            <GenericList data={data} fields={cfg.listFields || []} mode="view" onEdit={handleEditItem} onDelete={handleDeleteItem}/>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}