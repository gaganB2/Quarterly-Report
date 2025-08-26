// src/theme.js
import { createTheme } from '@mui/material/styles';

const sharedThemeConfig = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
};

export const lightTheme = createTheme({
  ...sharedThemeConfig,
  palette: {
    mode: 'light',
    primary: { main: '#007BFF' },
    background: {
      default: '#f4f7fa',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    text: { primary: '#1a2027', secondary: '#6c757d' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(209, 213, 219, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(209, 213, 219, 0.3)',
        },
      },
    },
    // --- FIX: The flawed MuiDialog override has been REMOVED ---
  },
});

export const darkTheme = createTheme({
  ...sharedThemeConfig,
  palette: {
    mode: 'dark',
    primary: { main: '#3689ff' },
    background: {
      default: '#121212',
      paper: 'rgba(30, 30, 30, 0.7)',
    },
    text: { primary: '#ffffff', secondary: '#adb5bd' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 30, 30, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // --- FIX: The flawed MuiDialog override has been REMOVED ---
  },
});