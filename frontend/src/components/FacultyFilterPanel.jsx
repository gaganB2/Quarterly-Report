// src/components/FacultyFilterPanel.jsx

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  Typography,
  IconButton,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { YEAR_OPTIONS, QUARTER_OPTIONS } from '../config/formConstants';

// Helper function to get the current quarter and year
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

export default function FacultyFilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    session: '',
    year: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { session: currentSession, year: currentYear } = getCurrentQuarter();

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApply = () => {
    // Pass only the active filters to the parent
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});
    onFilterChange(activeFilters);
  };

  const handleReset = () => {
    setFilters({ session: '', year: '' });
    onFilterChange({}); // Pass empty object to show all submissions
  };
  
  const handleSetCurrent = () => {
    const current = { session: currentSession, year: currentYear };
    setFilters(current);
    onFilterChange(current);
  };

  return (
    <Box>
      {/* This is the main button that is always visible */}
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Session (Quarter)</InputLabel>
                <Select
                  name="session"
                  value={filters.session}
                  label="Session (Quarter)"
                  onChange={handleFilterChange}
                >
                  {QUARTER_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  name="year"
                  value={filters.year}
                  label="Year"
                  onChange={handleFilterChange}
                >
                  {YEAR_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} container spacing={1} justifyContent="flex-end">
              <Grid item>
                <Button onClick={handleReset} variant="text">Reset</Button>
              </Grid>
              <Grid item>
                <Button onClick={handleApply} variant="contained">Apply</Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleSetCurrent} size="small">
                Filter by Current Quarter ({currentSession}, {currentYear})
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>
    </Box>
  );
}