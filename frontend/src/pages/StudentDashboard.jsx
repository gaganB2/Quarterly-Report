// src/pages/StudentDashboard.jsx

import React, { useMemo } from 'react';
// FIX: Import the 'alpha' function from Material-UI
import { Container, Paper, Typography, Box, Divider, Breadcrumbs, Link, useTheme, alpha } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { formSections } from '../config/formConfig';
import FormTable from '../components/FormTable';
import { motion } from 'framer-motion';

// --- Main Student Dashboard Component ---
export default function StudentDashboard() {
  const { user } = useAuth();
  const theme = useTheme();

  // Filter the form sections to show only student-specific forms (S-series, excluding S1.1)
  const studentForms = useMemo(() => {
    return formSections.filter(section => section.code.startsWith('S') && section.code !== 'S1.1');
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 72px)', // Adjust for topbar height
        width: '100%',
        py: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 50%)`,
        transition: 'background 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main content container with Glassmorphism effect */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: '16px',
              // Glassmorphism styles
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
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

            {/* Render the FormTable with only the filtered student forms */}
            <FormTable
              filters={{}} // Students don't have filters on their own dashboard
              formCounts={{}} // Counts are not required for the student view
              countsLoading={false}
              visibleSections={studentForms} // Pass the filtered list here
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
