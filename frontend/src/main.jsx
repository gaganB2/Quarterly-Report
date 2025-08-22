// src/main.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';
import ColorModeContext from './ThemeContext';
// +++ Import the SnackbarProvider +++
import { SnackbarProvider } from 'notistack';

function Root() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
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
        {/* +++ Wrap the application with SnackbarProvider +++ */}
        {/* This enables snackbar notifications throughout the app. */}
        {/* We configure it to show a max of 3 notifications at a time. */}
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