// src/components/FilterPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { formSections } from "../config/formConfig";

const yearOptions = [
  { label: "All Years", value: "" },
  ...Array.from(
    { length: 2099 - 1986 + 1 },
    (_, i) => {
      const start = 1986 + i;
      return {
        label: `${start} – ${start + 1}`,
        value: start,
      };
    }
  ),
];

const sessionOptions = [
  { label: "All Sessions", value: "" },
  { label: "Q1: July – Sep", value: "Q1" },
  { label: "Q2: Oct – Dec", value: "Q2" },
  { label: "Q3: Jan – Mar", value: "Q3" },
  { label: "Q4: Apr – Jun", value: "Q4" },
];

export default function FilterPanel({ onApply, initial }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(initial);

  // If parent-level filters ever change, mirror them locally
  useEffect(() => {
    setF(initial);
  }, [initial]);

  const change =
    (key, immediate = false) =>
    (e) => {
      const next = { ...f, [key]: e.target.value };
      setF(next);
      if (immediate) onApply(next);
    };

  const apply = () => onApply(f);

  // Reset back to “no form, but default session/year, empty search”
  const reset = () => {
    const cleared = {
      form: "",
      session: initial.session,
      year: initial.year,
      title: "",
      journal: "",
    };
    setF(cleared);
    onApply(cleared);
  };

  return (
    <Box mb={3}>
      {/* Row 1: toggle */}
      <Button variant="outlined" onClick={() => setOpen((o) => !o)}>
        Search & Filter
      </Button>

      {/* Row 2: controls */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          mt={2}
          p={2}
          bgcolor="background.paper"
          borderRadius={1}
          display="flex"
          flexWrap="wrap"
          gap={2}
        >
          {/* Form */}
          <FormControl
            size="small"
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
          >
            <InputLabel>Form</InputLabel>
            <Select label="Form" value={f.form} onChange={change("form")}>
              <MenuItem value="">All Forms</MenuItem>
              {formSections.map((s) => (
                <MenuItem key={s.code} value={s.code}>
                  {s.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Session */}
          <FormControl
            size="small"
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
          >
            <InputLabel>Session</InputLabel>
            <Select
              label="Session"
              value={f.session}
              onChange={change("session")}
            >
              {sessionOptions.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year */}
          <FormControl
            size="small"
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
          >
            <InputLabel>Year</InputLabel>
            <Select label="Year" value={f.year} onChange={change("year")}>
              {yearOptions.map((y) => (
                <MenuItem key={y.value} value={y.value}>
                  {y.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Title contains (instant) */}
          <TextField
            size="small"
            label="Title contains"
            value={f.title}
            onChange={change("title", true)}
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
          />

          {/* Journal contains (instant) */}
          <TextField
            size="small"
            label="Journal contains"
            value={f.journal}
            onChange={change("journal", true)}
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
          />

          {/* Action buttons */}

          <Box
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button variant="contained" onClick={apply}>
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={reset}>
              Reset Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
