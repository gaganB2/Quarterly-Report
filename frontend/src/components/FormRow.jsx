// src/components/FormRow.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Button, Collapse, Box, Divider, Dialog, AppBar, Toolbar, IconButton,
  Typography, Chip, useTheme, CircularProgress, Alert, alpha, Container,
  DialogTitle, Tooltip, Paper, Grid, Stack
} from "@mui/material";
import { 
  Close as CloseIcon, 
  FileDownload as DownloadIcon, 
  UploadFile as UploadIcon,
  Add as AddIcon
} from '@mui/icons-material';
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";
import { motion } from "framer-motion";
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import ImportDialog from "./ImportDialog";

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MotionPaper = motion(Paper);
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
    label: key.charAt(0).toUpperCase() + key.slice(1), value,
  }));
  if (activeFilters.length === 0) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>Active Filters:</Typography>
      {activeFilters.map(f => (<Chip key={f.label} label={`${f.label}: ${f.value}`} size="small" />))}
    </Box>
  );
};

export default function FormRow({ form, idx, filters, isActive, onToggleActive, count, isLoadingCount, refreshCounts }) {
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
  if (!cfg || !cfg.endpoint) return null;

  const loadData = useCallback(async () => {
    setIsLoading(true); setError(null);
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
    if (isActive && ['view', 'edit', 'delete'].includes(mode)) loadData();
    if (!isActive) { setData([]); setError(null); setEditData(null); }
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
      loadData();
      refreshCounts();
    } catch (err) {
       setError("Failed to delete the entry. Please try again.");
    }
  };

  const handleSuccess = () => {
    onToggleActive(form.code);
    refreshCounts();
  };

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
        if (filenameMatch && filenameMatch.length === 2) filename = filenameMatch[1];
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

    if (mode === "add") return <GenericForm FormComponent={cfg.FormComponent} onSuccess={handleSuccess} session={formSession} year={formYear} />;
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
  
  const actionButtonStyles = {
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '50px',
    px: 2.5
  };

  return (
    <React.Fragment>
      <MotionPaper
        key={form.code}
        variants={rowVariants}
        custom={idx}
        sx={{
          p: {xs: 2, sm: 2.5},
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.2),
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <Grid container alignItems="center" spacing={2} wrap="wrap">
          <Grid item xs={12} sm>
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '1rem', minWidth: '24px' }}>
                {idx + 1}
              </Typography>
              <Box>
                <Typography sx={{ 
                  fontWeight: 800, 
                  fontSize: '1.25rem', 
                  background: 'linear-gradient(45deg, #4A00E0, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {form.code}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {form.title}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm="auto">
            <Stack direction="row" alignItems="center" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1} flexWrap="wrap">
              {isLoadingCount ? <CircularProgress size={24} /> : (
                <Chip label={count ?? 0} variant={count > 0 ? 'filled' : 'outlined'} color={count > 0 ? "primary" : "default"} sx={{fontWeight: 700, mr: 1}}/>
              )}
              <Button onClick={() => handleOpen('add')} variant="contained" color="primary" sx={actionButtonStyles}>Add</Button>
              <Button onClick={() => handleOpen('view')} sx={actionButtonStyles}>View</Button>
              <Button onClick={() => handleOpen('edit')} color="warning" sx={{...actionButtonStyles, minWidth: 'auto', px: 2}}>Edit</Button>
              <Button onClick={() => handleOpen('delete')} color="error" sx={{...actionButtonStyles, minWidth: 'auto', px: 2}}>Delete</Button>
              <Tooltip title="Import from Excel"><IconButton onClick={() => setImportOpen(true)}><UploadIcon /></IconButton></Tooltip>
              <Tooltip title="Export to Excel"><IconButton onClick={handleExport}><DownloadIcon /></IconButton></Tooltip>
            </Stack>
          </Grid>
        </Grid>

        <Collapse in={isActive} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>
            {renderPanelContent()}
          </Box>
        </Collapse>
      </MotionPaper>
      
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
        onImportSuccess={() => {
          loadData();
          refreshCounts();
        }}
      />
    </React.Fragment>
  );
}