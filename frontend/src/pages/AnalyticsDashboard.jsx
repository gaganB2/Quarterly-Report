// src/pages/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '../api/axios';

const SubmissionsChart = ({ data }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        T1.1 Submissions by Department
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Submissions" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default function AnalyticsDashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/analytics/submissions-by-department/');
        setChartData(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
        setError('Could not load chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3 }}>
          Analytics Dashboard
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SubmissionsChart data={chartData} />
            </Grid>
            {/* Future charts can be added here as new Grid items */}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}