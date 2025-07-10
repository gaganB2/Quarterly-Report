// src/components/InspectorPanel.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function InspectorPanel() {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Inspector
      </Typography>
      {/* TODO: Add property controls here */}
    </Box>
  );
}
