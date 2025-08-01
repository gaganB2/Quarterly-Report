// src/pages/HomePage.jsx
import React, { useState } from "react";
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

export default function HomePage() {
  const theme = useTheme();
  const { user } = useAuth(); // Get the current user to check their role
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // This console log is for testing; we will connect this to the FormTable next.
    console.log("Applying filters to HomePage:", newFilters);
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
          
          {/* Conditionally render the AdminFilterPanel only for Admin users */}
          {user && user.role === 'Admin' && (
            <AdminFilterPanel onFilterChange={handleFilterChange} />
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Pass the filters down to the FormTable */}
          <FormTable filters={filters} />
        </Paper>
      </Container>
    </Box>
  );
}