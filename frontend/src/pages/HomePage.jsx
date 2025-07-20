// src/pages/HomePage.jsx
import React from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import FormTable from "../components/FormTable";
import { Breadcrumbs, Link } from "@mui/material";

export default function HomePage() {
  const theme = useTheme();

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
          <Divider sx={{ mb: 3 }} />

          {/* Submission Sections Table */}
          <FormTable />
        </Paper>
      </Container>
    </Box>
  );
}
