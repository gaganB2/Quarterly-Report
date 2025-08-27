// src/pages/StudentDashboard.jsx

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Breadcrumbs,
  Link,
  useTheme,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { formSections } from '../config/formConfig';
import FormTable from '../components/FormTable';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import apiClient from '../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // --- THIS IS THE NEW LOGIC FOR COUNTING ---
  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  // Filter the form sections to show only student-specific forms
  const studentForms = useMemo(() => {
    return formSections.filter(section => section.code.startsWith('S') && section.code !== 'S1.1');
  }, []);

  // Fetch the counts for the student's submissions
  const fetchCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      // For students, we fetch counts without any filters.
      // The backend will automatically scope this to the logged-in user.
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
  // --- END OF NEW LOGIC ---

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: { xs: 2, sm: 4 } }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link underline="hover" color="inherit" href="/login/student">
                Login
              </Link>
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs>

            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Welcome, {user?.full_name || 'Student'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This is your personal dashboard. Please use the sections below to submit your quarterly reports.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* The FormTable now receives the real count data */}
            <FormTable
              filters={{}} 
              formCounts={formCounts}
              countsLoading={countsLoading}
              visibleSections={studentForms}
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}