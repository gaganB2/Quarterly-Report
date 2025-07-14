import React, { useState } from "react";
import { Box, Container, Typography, Divider, Paper } from "@mui/material";
import SessionSelector from "../components/SessionSelector";
import FormTable from "../components/FormTable";

export default function HomePage() {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Quarterly Report Submissions
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Select session and year to view and manage your form submissions.
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Session Selector */}
          <SessionSelector
            selectedQuarter={selectedQuarter}
            setSelectedQuarter={setSelectedQuarter}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />

          {/* Conditionally show table */}
          {selectedQuarter && selectedYear ? (
            // <FormTable quarter={selectedQuarter} year={selectedYear} />
            <FormTable session={selectedQuarter} year={selectedYear} />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 4, textAlign: "center" }}
            >
              Please select a session and year to proceed.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
