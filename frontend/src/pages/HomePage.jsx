// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid, // Import Grid for layout
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import FormTable from "../components/FormTable";
import AdminFilterPanel from "../components/AdminFilterPanel";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";

// Helper function to get the current quarter and year for non-admin users
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

export default function HomePage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState(() => {
    if (user && user.role !== 'Admin') {
      return getCurrentQuarter();
    }
    return {};
  });
  
  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

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
    // The main container. The background is now applied globally from App.jsx
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* --- FIX: Header content is now outside of any Paper component --- */}
      {/* This makes it feel like part of the page, not part of a card. */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2, color: 'text.primary' }}>
          <Link underline="hover" color="inherit" href="/">
            Log-in
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>Quarterly Reports</Typography>
        </Breadcrumbs>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
          Quarterly Report Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your form submissions
        </Typography>
      </Box>

      {/* --- FIX: Use a Grid container to manage the layout of the "cards" --- */}
      {/* This creates the floating card effect with proper spacing. */}
      <Grid container spacing={4}>
        
        {/* The Admin Filter Panel is now its own card */}
        {user && user.role === 'Admin' && (
          <Grid item xs={12}>
            <AdminFilterPanel onFilterChange={handleFilterChange} />
          </Grid>
        )}

        {/* The Form Table is the main content card */}
        <Grid item xs={12}>
          <FormTable
            filters={filters}
            formCounts={formCounts}
            countsLoading={countsLoading}
          />
        </Grid>

      </Grid>
      
    </Container>
  );
}