// src/components/FormRow.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  TableRow, TableCell, Button, Collapse, Box, Divider, Dialog, AppBar, Toolbar,
  IconButton, Typography, Chip, useTheme, CircularProgress, Alert, alpha, Container,
  DialogTitle, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FileDownload as DownloadIcon, UploadFile as UploadIcon } from '@mui/icons-material';
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";
import { motion } from "framer-motion";
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import ImportDialog from "./ImportDialog"; // --- Import the real dialog ---

const rowVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

const MotionTableRow = motion(TableRow);

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
  const { enqueueSnackbar } = useSnackbar();
  const [mode, setMode] = useState("add");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isImportOpen, setImportOpen] = useState(false);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) {
    return null;
  }

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams(filters).toString();
    const url = `/${cfg.endpoint}?${params}`;
    try {
      const res = await apiClient.get(url);
      setData(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [cfg.endpoint, filters]);

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
      await apiClient.delete(`/${cfg.endpoint}${item.id}/`);
      await loadData();
    } catch (err) {
       setError("Failed to delete the entry. Please try again.");
    }
  };

  const handleSuccess = () => { onToggleActive(form.code); };

  const handleExport = async () => {
    enqueueSnackbar("Generating your Excel report...", { variant: 'info' });
    try {
        const params = new URLSearchParams(filters).toString();
        const url = `/${cfg.endpoint}export-excel/?${params}`;
        const response = await apiClient.get(url, { responseType: 'blob' });
        
        const contentDisposition = response.headers['content-disposition'];
        let filename = `Report_${form.code}.xlsx`;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch.length === 2)
                filename = filenameMatch[1];
        }
        
        saveAs(response.data, filename);
    } catch (error) {
        console.error("Failed to export data:", error);
        enqueueSnackbar("Failed to generate report. Please try again.", { variant: 'error' });
    }
  };

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

  const renderActionButton = (btnMode, label, color = "primary", variant = "text") => {
    const active = isActive && mode === btnMode;
    const isCollapse = active && ['add', 'view', 'edit', 'delete'].includes(btnMode);
    
    return (
      <Button
        size="small"
        onClick={() => handleOpen(btnMode)}
        sx={{ 
          minWidth: 64,
          fontWeight: 600,
        }}
        variant={active ? "contained" : variant}
        color={isCollapse ? color : "inherit"}
        {...(btnMode === 'add' && { color: 'success' })}
        {...(btnMode === 'edit' && { color: 'warning' })}
        {...(btnMode === 'delete' && { color: 'error' })}
      >
        {isCollapse ? "Collapse" : label}
      </Button>
    );
  };

  return (
    <React.Fragment>
      <MotionTableRow
        key={`${form.code}-data`}
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        custom={idx}
        hover 
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell sx={{ pl: 3.5 }}>{idx + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" component="span" sx={{ flexGrow: 1 }}><strong>{form.code}</strong> — {form.title}</Typography>
            {isLoadingCount ? (<CircularProgress size={18} thickness={5} />) : (count !== null && (
                <Chip label={count} size="small" color={count > 0 ? "primary" : "default"} variant={count > 0 ? "filled" : "outlined"}/>
            ))}
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ pr: 3.5 }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {renderActionButton("add", "Add", "success")}
            {renderActionButton("view", "View", "primary")}
            {renderActionButton("edit", "Edit", "warning")}
            {renderActionButton("delete", "Delete", "error")}
            
            <Tooltip title="Import data from Excel">
              <Button size="small" startIcon={<UploadIcon />} onClick={() => setImportOpen(true)}>Import</Button>
            </Tooltip>
            <Tooltip title="Export data to Excel">
              <Button size="small" startIcon={<DownloadIcon />} onClick={handleExport}>Export</Button>
            </Tooltip>
          </Box>
        </TableCell>
      </MotionTableRow>
      
      <TableRow key={`${form.code}-collapse`}>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <Collapse in={isActive} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1, p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.background.default, 0.7) }}>
              {renderPanelContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      
      <Dialog fullScreen open={fullOpen} onClose={() => setFullOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', background: theme.palette.background.default }}>
          <AppBar position="static">
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <IconButton edge="start" color="inherit" onClick={() => setFullOpen(false)}><CloseIcon /></IconButton>
                <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>{form.code} — Full Table</Typography>
              </Toolbar>
            </Container>
          </AppBar>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: { xs: 2, sm: 3 } }}>
            <Container maxWidth="xl">
              <FilterDisplay filters={filters} />
              <GenericList data={data} fields={cfg.listFields || []} mode="view" onEdit={handleEditItem} onDelete={handleDeleteItem}/>
            </Container>
          </Box>
        </Box>
      </Dialog>
      
      <ImportDialog
        open={isImportOpen}
        onClose={() => setImportOpen(false)}
        formCode={form.code}
        formTitle={form.title}
        onSuccess={() => {
          setImportOpen(false);
          loadData();
        }}
      />
    </React.Fragment>
  );
}