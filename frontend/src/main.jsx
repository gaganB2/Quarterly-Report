// src/main.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';
import ColorModeContext from './ThemeContext';
import { SnackbarProvider } from 'notistack';
import './index.css'; // Ensure the global CSS is imported

function Root() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  // --- THIS IS THE DEFINITIVE FIX ---
  // This effect listens for changes in the 'mode' and updates the global CSS variables.
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    const root = document.documentElement;
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;
    
    // Set the variables for the scrollbar
    if (mode === 'dark') {
      root.style.setProperty('--scrollbar-thumb-color', '#424242');
      root.style.setProperty('--scrollbar-thumb-hover-color', '#555555');
      // For dark mode, the track needs a color to create the padding effect
      root.style.setProperty('--scrollbar-track-color', currentTheme.palette.background.default);
    } else {
      root.style.setProperty('--scrollbar-thumb-color', '#b0b0b0');
      root.style.setProperty('--scrollbar-thumb-hover-color', '#8e8e8e');
      root.style.setProperty('--scrollbar-track-color', 'transparent');
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <CssBaseline />
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);