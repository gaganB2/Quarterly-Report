// src/components/AdminFilterPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // The corrected Grid import
import apiClient from '../api/axios';
import { QUARTER_OPTIONS, YEAR_OPTIONS } from '../config/formConstants';

const AdminFilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    quarter: '',
    year: '',
    department: '',
    faculty: '',
    title: '',
    journal_name: '',
  });
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    apiClient.get('/api/admin/departments/')
      .then(res => setDepartments(res.data.results || res.data))
      .catch(err => console.error("Failed to fetch departments", err));

    apiClient.get('/api/admin/users/')
      .then(res => {
        const allUsers = res.data.results || res.data;
        const facultyAndHods = allUsers.filter(user => user.role === 'Faculty' || user.role === 'HOD');
        setFacultyList(facultyAndHods);
      })
      .catch(err => console.error("Failed to fetch faculty list", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    onFilterChange(activeFilters);
  };

  const handleResetFilters = () => {
    const clearedFilters = {
      quarter: '', year: '', department: '', faculty: '', title: '', journal_name: ''
    };
    setFilters(clearedFilters);
    onFilterChange({});
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Admin Search & Filter
      </Typography>
      <Grid container spacing={2} alignItems="center">
        
        <Grid xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="quarter-filter-label">Quarter</InputLabel>
            <Select
              labelId="quarter-filter-label"
              name="quarter"
              value={filters.quarter}
              label="Quarter"
              onChange={handleChange}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {QUARTER_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="year-filter-label">Year</InputLabel>
            <Select
              labelId="year-filter-label"
              name="year"
              value={filters.year}
              label="Year"
              onChange={handleChange}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {YEAR_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="department-filter-label">Department</InputLabel>
            <Select
              labelId="department-filter-label"
              name="department"
              value={filters.department}
              label="Department"
              onChange={handleChange}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="faculty-filter-label">Faculty</InputLabel>
            <Select
              labelId="faculty-filter-label"
              name="faculty"
              value={filters.faculty}
              label="Faculty"
              onChange={handleChange}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {facultyList.map(fac => (
                <MenuItem key={fac.id} value={fac.id}>{fac.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <TextField
            name="title"
            label="Title Contains"
            value={filters.title}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <TextField
            name="journal_name"
            label="Journal/Conf. Contains"
            value={filters.journal_name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: { xs: 1, md: 0 } }}>
          <Button onClick={handleResetFilters} variant="outlined">
            Reset
          </Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminFilterPanel;