// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

// --- Shared Theme Configuration ---
const sharedThemeConfig = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16, // A slightly larger radius for a softer, modern look
  },
};

// --- Light Theme ---
export const lightTheme = createTheme({
  ...sharedThemeConfig,
  palette: {
    mode: 'light',
    primary: { main: '#007BFF' },
    success: { main: '#28a745' },
    warning: { main: '#ffc107' },
    error: { main: '#dc3545' },
    background: {
      default: '#f4f7fa',
      // --- FIX: Softer, off-white glass color ---
      paper: 'rgba(255, 255, 255, 0.65)', 
    },
    text: { primary: '#1a2027', secondary: '#6c757d' },
  },
  components: {
    // --- The Core of the Glassmorphism Effect ---
    MuiPaper: {
      styleOverrides: {
        root: {
          // Fallback for older browsers
          backgroundColor: alpha('#ffffff', 0.6), 
          // The blur effect
          backdropFilter: 'blur(24px) saturate(180%)',
          // A subtle border to help the "glass" stand out
          border: '1px solid rgba(209, 213, 219, 0.3)',
          // --- ENHANCEMENT: A more complex shadow for a "deep" floating effect ---
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
  },
});

// --- Dark Theme ---
export const darkTheme = createTheme({
  ...sharedThemeConfig,
  palette: {
    mode: 'dark',
    primary: { main: '#3689ff' },
    success: { main: '#34c38f' },
    warning: { main: '#f1b44c' },
    error: { main: '#f46a6a' },
    background: {
      default: '#121212',
      // --- FIX: Softer, off-black glass color ---
      paper: 'rgba(30, 30, 30, 0.75)',
    },
    text: { primary: '#ffffff', secondary: '#adb5bd' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(24px) saturate(180%)',
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
  },
});