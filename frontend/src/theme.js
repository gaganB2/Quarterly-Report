// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Your brand colors from the logo
const BIT_BLUE = '#005BBB';
const BIT_YELLOW = '#FFC20E';
const BIT_RED = '#D71920';

// Common “glass panel” background
const PANEL_BG = 'rgba(255,255,255,0.2)';
const PANEL_BG_DARK = 'rgba(0,0,0,0.4)';

function makeTheme(mode, highContrast = false) {
  const isDark = mode === 'dark';
  const base = createTheme({
    palette: {
      mode,
      primary: {
        main: BIT_BLUE,
        contrastText: '#fff',
      },
      secondary: {
        main: BIT_YELLOW,
        contrastText: '#000',
      },
      error: {
        main: BIT_RED,
      },
      background: {
        default: isDark ? '#121212' : '#f0f2f5',
        paper: highContrast ? PANEL_BG_DARK : PANEL_BG,
      },
      text: {
        primary: highContrast
          ? '#fff'
          : isDark
          ? 'rgba(255,255,255,0.87)'
          : 'rgba(0,0,0,0.87)',
        secondary: highContrast
          ? 'rgba(255,255,255,0.7)'
          : isDark
          ? 'rgba(255,255,255,0.6)'
          : 'rgba(0,0,0,0.6)',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0px 2px 8px rgba(0,0,0,0.1)', // use this as your “card” shadow
      /* ...rest of default shadows */
    ],
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s, color 0.3s',
          },
        },
      },
    },
  });

  return responsiveFontSizes(base);
}

export const lightTheme = makeTheme('light', false);
export const darkTheme = makeTheme('dark', false);
export const highContrastTheme = makeTheme('dark', true);
