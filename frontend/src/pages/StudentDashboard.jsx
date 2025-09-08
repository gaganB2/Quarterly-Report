// src/pages/StudentDashboard.jsx

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { formSections } from '../config/formConfig';
import FormTable from '../components/FormTable';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import apiClient from '../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  const studentForms = useMemo(() => {
    return formSections.filter(section => section.code.startsWith('S') && section.code !== 'S1.1');
  }, []);

  const fetchCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      const url = `/api/reports/counts/`;
      const response = await apiClient.get(url);
      setFormCounts(response.data.counts || {});
    } catch (error) {
      console.error("Failed to fetch report counts for student:", error);
      enqueueSnackbar("Could not load your submission counts.", { variant: "error" });
      setFormCounts({});
    } finally {
      setCountsLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* --- FIX: Use Box instead of Paper for a cleaner, integrated look --- */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
              Welcome, {user?.full_name || 'Student'}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
              This is your personal dashboard. Please use the sections below to submit your reports.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* --- FIX: Pass the correct props to the refactored FormTable --- */}
            <FormTable
              filters={{}} // Students don't have filters
              formCounts={formCounts}
              countsLoading={countsLoading}
              visibleSections={studentForms}
              FilterPanel={null} // Pass null as there is no filter panel
              refreshCounts={fetchCounts}
            />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}