// src/components/ImportDialog.jsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  Alert, CircularProgress, List, ListItem, ListItemText,
  alpha, Divider, Stack, IconButton
} from '@mui/material';
import { 
  FileDownload as DownloadIcon, 
  UploadFile as UploadIcon, 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon, 
  Warning as WarningIcon,
  Replay as ReplayIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { formConfig } from '../config/formConfig';
import apiClient from '../api/axios';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

const ImportResults = ({ result, onReset }) => {
  if (!result) return null;

  const isError = !!result.error;
  const isPartialFail = result.error_count > 0;
  
  const getResultState = () => {
    if (isError) return { 
      icon: <ErrorIcon sx={{ fontSize: 60 }} color="error" />,
      title: "Import Failed",
      message: result.error,
      severity: "error"
    };
    if (isPartialFail) return { 
      icon: <WarningIcon sx={{ fontSize: 60 }} color="warning" />,
      title: "Import Complete with Errors",
      message: `Successfully imported: ${result.success_count} rows. Failed to import: ${result.error_count} rows.`,
      severity: "warning"
    };
    return {
      icon: <CheckCircleIcon sx={{ fontSize: 60 }} color="success" />,
      title: "Import Successful",
      message: `All ${result.success_count} rows were imported successfully.`,
      severity: "success"
    };
  };

  const { icon, title, message, severity } = getResultState();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Stack spacing={2} alignItems="center" textAlign="center" my={3}>
        {icon}
        <Typography variant="h5" fontWeight={700}>{title}</Typography>
        <Alert severity={severity} sx={{ width: '100%' }}>{message}</Alert>

        {result.errors && result.errors.length > 0 && (
          <Box sx={{ width: '100%', maxHeight: 200, overflow: 'auto', mt: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <List dense>
              {result.errors.map((err, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    primary={`Row ${err.row_number}: Validation Failed`}
                    secondary={Object.entries(err.error_message).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join(' | ')}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Button onClick={onReset} startIcon={<ReplayIcon />}>
          Import Another File
        </Button>
      </Stack>
    </motion.div>
  );
};

export default function ImportDialog({ open, onClose, formCode, formTitle, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [importState, setImportState] = useState('uploading'); // 'uploading', 'processing', 'results'
  const { enqueueSnackbar } = useSnackbar();

  const config = formConfig[formCode];
  const endpoint = config?.endpoint;
  const modelName = config?.modelName;

  useEffect(() => {
    if (open) {
      setFile(null);
      setResult(null);
      setImportState('uploading');
    }
  }, [open, formCode]);

  const handleDownloadTemplate = () => {
    if (!endpoint) {
      enqueueSnackbar("Configuration error: Endpoint not found.", { variant: 'error' });
      return;
    }
    const url = `/${endpoint}download-template/`;
    enqueueSnackbar("Generating your template...", { variant: 'info' });

    apiClient.get(url, { responseType: 'blob' })
      .then(response => {
        saveAs(response.data, `Template_${formCode}.xlsx`);
      })
      .catch(error => {
        console.error("Failed to download template:", error);
        enqueueSnackbar("Error: Could not download the template file.", { variant: 'error' });
      });
  };

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!file || !modelName) {
      enqueueSnackbar("Please select a file to upload.", { variant: 'warning' });
      return;
    }
    setImportState('processing');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`/api/import/${modelName}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      if (response.data.success_count > 0) {
        onImportSuccess();
      }
    } catch (err) {
      setResult({ error: err.response?.data?.error || "An unexpected error occurred during import." });
    } finally {
      setImportState('results');
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setResult(null);
    setImportState('uploading');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
        Import Data for: <Box component="span" sx={{ color: 'primary.main' }}>{formTitle}</Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <AnimatePresence mode="wait">
          {importState === 'uploading' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>1. Download Template (Optional)</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  If you don't have the template, download it here. Do not change column names.
                </Typography>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
                  Download Template for {formCode}
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>2. Upload File</Typography>
                <Box {...getRootProps()} sx={{ p: 4, mt: 1, border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider', borderRadius: 2, textAlign: 'center', cursor: 'pointer', backgroundColor: isDragActive ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent' }}>
                  <input {...getInputProps()} />
                  <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  {file ? <Typography>File Ready: <strong>{file.name}</strong></Typography> : <Typography color="text.secondary">Drag & drop your .xlsx file here</Typography>}
                </Box>
              </Box>
            </motion.div>
          )}

          {importState === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Stack spacing={2} alignItems="center" my={4}>
                <CircularProgress size={60} />
                <Typography variant="h6">Processing your file...</Typography>
                <Typography color="text.secondary">Please wait.</Typography>
              </Stack>
            </motion.div>
          )}

          {importState === 'results' && (
            <Box key="results">
              <ImportResults result={result} onReset={handleReset} />
            </Box>
          )}
        </AnimatePresence>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {importState === 'uploading' && (
          <Button onClick={handleImport} variant="contained" disabled={!file}>
            Start Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}