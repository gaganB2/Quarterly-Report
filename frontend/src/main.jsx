// src/main.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import { lightTheme, darkTheme, highContrastTheme } from './theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import ContrastIcon from '@mui/icons-material/Contrast';

function Root() {
  // load saved preferences or default to light mode
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');
  const [contrast, setContrast] = useState(localStorage.getItem('contrast') === 'true');

  // persist changes
  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);
  useEffect(() => {
    localStorage.setItem('contrast', contrast);
  }, [contrast]);

  // pick the appropriate theme
  let theme = lightTheme;
  if (contrast) theme = highContrastTheme;
  else if (mode === 'dark') theme = darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        {/* Floating theme toggles */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: theme.zIndex.tooltip,
          }}
        >
          {/* Light / Dark */}
          <IconButton
            onClick={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))}
            color="inherit"
            aria-label="Toggle light/dark mode"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 3,
              '&:hover': { boxShadow: 6 },
            }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* High Contrast */}
          <IconButton
            onClick={() => setContrast(prev => !prev)}
            color="inherit"
            aria-label="Toggle high contrast mode"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 3,
              '&:hover': { boxShadow: 6 },
            }}
          >
            <ContrastIcon />
          </IconButton>
        </Box>

        {/* Your entire app (including Topbar + Routes) */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
