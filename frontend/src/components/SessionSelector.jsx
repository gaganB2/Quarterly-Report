// src/components/SessionSelector.jsx
import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

const sessionOptions = [
  { label: "July – September", value: "Q1" },
  { label: "October – December", value: "Q2" },
  { label: "January – March", value: "Q3" },
  { label: "April – June", value: "Q4" },
];

const SessionSelector = ({
  selectedQuarter,
  setSelectedQuarter,
  selectedYear,
  setSelectedYear,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Select Academic Session
      </Typography>

      {/* Flex container */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Quarter Dropdown */}
        <FormControl
          fullWidth
          sx={{
            flex: {
              xs: "1 1 100%",   // full width on xs
              sm: "1 1 45%",    // two columns on sm
              md: "1 1 30%",    // three-ish columns on md+
            },
          }}
        >
          <InputLabel>Quarter</InputLabel>
          <Select
            value={selectedQuarter}
            label="Quarter"
            onChange={(e) => setSelectedQuarter(e.target.value)}
            required
          >
            {sessionOptions.map((q) => (
              <MenuItem key={q.value} value={q.value}>
                {q.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Dropdown */}
        <FormControl
          fullWidth
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 45%",
              md: "1 1 30%",
            },
          }}
        >
          <InputLabel>Academic Year</InputLabel>
          <Select
            value={selectedYear}
            label="Academic Year"
            onChange={(e) => setSelectedYear(e.target.value)}
            required
          >
            {Array.from({ length: 6 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <MenuItem key={year} value={year}>
                  {year} – {year + 1}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SessionSelector;
