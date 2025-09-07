// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Box,
  Grid,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { formSections } from "../config/formConfig";
import FormTable from "../components/FormTable";
import AdminFilterPanel from "../components/AdminFilterPanel";
import FacultyFilterPanel from "../components/FacultyFilterPanel";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";

export default function HomePage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState({});
  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      // Create a new URLSearchParams object from the current filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const params = new URLSearchParams(activeFilters).toString();
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
  }, [filters, enqueueSnackbar]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
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

  const FilterComponent = user?.role === 'Admin' 
    ? <AdminFilterPanel onFilterChange={handleFilterChange} /> 
    : <FacultyFilterPanel onFilterChange={handleFilterChange} />;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={12}>
            <FormTable
              filters={filters}
              formCounts={formCounts}
              countsLoading={countsLoading}
              visibleSections={visibleSections}
              FilterPanel={FilterComponent} 
              refreshCounts={fetchCounts}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}