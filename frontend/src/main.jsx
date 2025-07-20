// src/main.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import { lightTheme, darkTheme, highContrastTheme } from './theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import ContrastIcon from '@mui/icons-material/Contrast';
import { AuthProvider } from './context/AuthContext'; // ✅ Import

function Root() {
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');
  const [contrast, setContrast] = useState(localStorage.getItem('contrast') === 'true');

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('contrast', contrast);
  }, [contrast]);

  let theme = lightTheme;
  if (contrast) theme = highContrastTheme;
  else if (mode === 'dark') theme = darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider> 
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
