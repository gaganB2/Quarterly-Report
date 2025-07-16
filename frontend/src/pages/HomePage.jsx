// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Container, Box, Typography, Divider } from "@mui/material";
import FilterPanel from "../components/FilterPanel";
import FormTable from "../components/FormTable";

const getCurrentQuarter = () => {
  const m = new Date().getMonth() + 1;
  if (m <= 3) return "Q3";
  if (m <= 6) return "Q4";
  if (m <= 9) return "Q1";
  return "Q2";
};
const getCurrentAcademicYear = () => {
  const now = new Date();
  return now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
};

export default function HomePage() {
  const defaultSession = getCurrentQuarter();
  const defaultYear = getCurrentAcademicYear();
  const [filters, setFilters] = useState({
    form: "",
    session: defaultSession,
    year: defaultYear,
    title: "",
    journal: "",
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Quarterly Report Submissions
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Manage your form submissions
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <FilterPanel onApply={setFilters} initial={filters} />

        {/* Pass filters into FormTable */}
        <FormTable filters={filters} />
      </Box>
    </Container>
  );
}
