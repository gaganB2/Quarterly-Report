import React from "react";
import { Container, Box, Typography, Divider } from "@mui/material";
import FormTable from "../components/FormTable";

export default function HomePage() {
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

        {/* Submission sections only */}
        <FormTable />
      </Box>
    </Container>
  );
}
