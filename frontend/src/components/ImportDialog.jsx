// src/components/ImportDialog.jsx

import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  Alert, CircularProgress, List, ListItem, ListItemText,
  alpha, Divider
} from '@mui/material';
// --- FIX: Import the missing CheckCircleIcon ---
import { FileDownload as DownloadIcon, UploadFile as UploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { formConfig } from '../config/formConfig';
import apiClient from '../api/axios';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';

export default function ImportDialog({ open, onClose, formCode, formTitle, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const config = formConfig[formCode];
  const endpoint = config?.endpoint;
  const modelName = config?.modelName;

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
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`/api/import/${modelName}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      if (response.data.success_count > 0) {
        onSuccess();
      }
    } catch (err) {
      setResult({ error: err.response?.data?.error || "An unexpected error occurred during import." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
        Import Data for: <Box component="span" sx={{ color: 'primary.main' }}>{formTitle}</Box>
      </DialogTitle>
      <DialogContent>
        {/* Section 1: Download Template */}
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>Download Template</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To ensure data integrity, you must use our official template. Do not change column names or order.
          </Typography>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
            Download Template for {formCode}
          </Button>
        </Box>

        <Divider />

        {/* Section 2: Upload File */}
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>Upload File</Typography>
          <Box
            {...getRootProps()}
            sx={{
              p: 4, mt: 1, border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 2, textAlign: 'center', cursor: 'pointer',
              backgroundColor: isDragActive ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
              transition: 'background-color 0.2s ease, border-color 0.2s ease'
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            {file ? (
              <Typography>File Ready: <strong>{file.name}</strong></Typography>
            ) : (
              <Typography color="text.secondary">Drag & drop your .xlsx file here, or click to select</Typography>
            )}
          </Box>
        </Box>

        {/* Section 3: Results */}
        {result && (
          <Box sx={{ pt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6">Import Summary</Typography>
            {result.error ? ( <Alert severity="error">{result.error}</Alert> ) : (
              <>
                <Alert severity={result.error_count > 0 ? 'warning' : 'success'}>
                  Successfully imported: {result.success_count} rows. <br />
                  Failed to import: {result.error_count} rows.
                </Alert>
                {result.error_count > 0 && (
                  <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <List dense>
                      {result.errors.map((err, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={`Row ${err.row_number}: Validation Failed`}
                            secondary={JSON.stringify(err.error_message)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleImport} variant="contained" disabled={!file || loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}>
          {loading ? 'Importing...' : 'Start Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}