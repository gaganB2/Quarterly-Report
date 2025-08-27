// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { formSections } from "../config/formConfig";
import FormTable from "../components/FormTable";
import AdminFilterPanel from "../components/AdminFilterPanel";
import FacultyFilterPanel from "../components/FacultyFilterPanel"; // --- 1. Import the new component ---
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";

export default function HomePage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // --- 2. State now defaults to empty, allowing "view all" for everyone ---
  const [filters, setFilters] = useState({});
  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  const visibleSections = useMemo(() => {
    if (!user) return [];

    switch (user.role) {
      case 'Admin':
        return formSections;
      case 'HOD':
      case 'Faculty':
        return formSections.filter(section => section.code.startsWith('T') || section.code === 'S1.1');
      default:
        return [];
    }
  }, [user]);

  useEffect(() => {
    const fetchCounts = async () => {
      setCountsLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const url = `/api/reports/counts/?${params}`;
        const response = await apiClient.get(url);
        setFormCounts(response.data.counts || {});
      } catch (error) {
        console.error("Failed to fetch report counts:", error);
        enqueueSnackbar("Could not load submission counts.", { variant: "error" });
        setFormCounts({});
      } finally {
        setCountsLoading(false);
      }
    };
    fetchCounts();
  }, [filters, enqueueSnackbar]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2, color: 'text.primary' }}>
            <Link underline="hover" color="inherit" href="/">Log-in</Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>Quarterly Reports</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
            Quarterly Report Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your form submissions
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            {/* --- 3. Conditionally render the correct filter panel based on user role --- */}
            {user && user.role === 'Admin' ? (
              <AdminFilterPanel onFilterChange={handleFilterChange} />
            ) : (
              <FacultyFilterPanel onFilterChange={handleFilterChange} />
            )}
          </Grid>
          
          <Grid item xs={12}>
            <FormTable
              filters={filters}
              formCounts={formCounts}
              countsLoading={countsLoading}
              visibleSections={visibleSections}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}