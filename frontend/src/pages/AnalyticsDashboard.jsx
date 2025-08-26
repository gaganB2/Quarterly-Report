// src/pages/AnalyticsDashboard.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme,
  alpha,
  Icon,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';
import { YEAR_OPTIONS, QUARTER_OPTIONS } from '../config/formConstants';
import { Assessment, TrendingUp, FilterList, BarChart as BarChartIcon } from '@mui/icons-material';

// --- Reusable Components (Enhanced) ---

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(color, 0.1),
        }}>
          <Icon component={icon} sx={{ fontSize: 28, color: color }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const SubmissionsChart = ({ data, title }) => {
  const theme = useTheme();
  return (
    <Paper sx={{ p: 3, height: '500px' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(5px)',
              borderRadius: '8px',
              borderColor: theme.palette.divider,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="count" fill={theme.palette.primary.main} name="Submissions" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

// --- Main Dashboard Component ---

export default function AnalyticsDashboard() {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', year: '', quarter: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/analytics/categories/');
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics categories", err);
        setError('Could not load filter options.');
      }
    };
    fetchCategories();
  }, []);

  const fetchChartData = useCallback(async (currentFilters) => {
    setLoading(true);
    setError('');
    try {
      const activeFilters = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      const params = new URLSearchParams(activeFilters).toString();
      const response = await apiClient.get(`/api/analytics/department-submissions/?${params}`);
      setChartData(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
      setError('Could not load chart data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData(filters);
  }, []); // Fetch data only on initial mount

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    fetchChartData(filters);
  };

  const totalSubmissions = useMemo(() => chartData.reduce((sum, item) => sum + item.count, 0), [chartData]);
  const topDepartmentData = useMemo(() => chartData.length > 0 ? chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0]) : { department: 'N/A', count: 0 }, [chartData]);

  const getChartTitle = () => {
    const selectedCategory = categories.find(c => c.key === filters.category);
    return selectedCategory ? `Submissions for "${selectedCategory.display_name}"` : 'All Submissions by Department';
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
            Analytics Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Visualize submission data across the institution.
          </Typography>

          <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid item xs={12} md={4}><StatCard title="Total Submissions" value={loading ? <CircularProgress size={24} /> : totalSubmissions} icon={Assessment} color={theme.palette.primary.main} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Top Department" value={loading ? <CircularProgress size={24} /> : topDepartmentData.department} icon={TrendingUp} color={theme.palette.success.main} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Form Categories" value={categories.length > 0 ? categories.length : <CircularProgress size={24} />} icon={BarChartIcon} color={theme.palette.warning.main} /></Grid>
            
            {/* Filter Panel */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs><Typography fontWeight={600}>Filters</Typography></Grid>
                  <Grid item xs={12} md={3}><FormControl fullWidth size="small"><InputLabel>Category</InputLabel><Select name="category" value={filters.category} label="Category" onChange={handleFilterChange}><MenuItem value=""><em>All Categories</em></MenuItem>{categories.map(cat => (<MenuItem key={cat.key} value={cat.key}>{cat.display_name}</MenuItem>))}</Select></FormControl></Grid>
                  <Grid item xs={12} sm={6} md={3}><FormControl fullWidth size="small"><InputLabel>Year</InputLabel><Select name="year" value={filters.year} label="Year" onChange={handleFilterChange}><MenuItem value=""><em>All Years</em></MenuItem>{YEAR_OPTIONS.map(opt => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}</Select></FormControl></Grid>
                  <Grid item xs={12} sm={6} md={3}><FormControl fullWidth size="small"><InputLabel>Quarter</InputLabel><Select name="quarter" value={filters.quarter} label="Quarter" onChange={handleFilterChange}><MenuItem value=""><em>All Quarters</em></MenuItem>{QUARTER_OPTIONS.map(opt => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}</Select></FormControl></Grid>
                  <Grid item xs={12} md="auto"><Button onClick={handleApplyFilters} variant="contained" size="large" startIcon={<FilterList />}>Apply</Button></Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Chart Area */}
            <Grid item xs={12}>
              {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
              {error && <Alert severity="error">{error}</Alert>}
              {!loading && !error && (
                <SubmissionsChart data={chartData} title={getChartTitle()} />
              )}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}