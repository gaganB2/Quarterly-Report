// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import FormTable from "../components/FormTable";
import AdminFilterPanel from "../components/AdminFilterPanel";
import { useSnackbar } from "notistack";
import apiClient from "../api/axios";

export default function HomePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState({});
  const [formCounts, setFormCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      setCountsLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        // +++ CORRECTED URL: Added the required '/api' prefix +++
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
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Paper
          elevation={1}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            p: { xs: 2, sm: 4, md: 5 },
            boxShadow: theme.shadows[1],
          }}
        >
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="/">
              Log-in
            </Link>
            <Typography color="text.primary">Quarterly Reports</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Quarterly Report Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your form submissions
          </Typography>
          
          {user && user.role === 'Admin' && (
            <AdminFilterPanel onFilterChange={handleFilterChange} />
          )}

          <Divider sx={{ mb: 3 }} />

          <FormTable
            filters={filters}
            formCounts={formCounts}
            countsLoading={countsLoading}
          />
        </Paper>
      </Container>
    </Box>
  );
}