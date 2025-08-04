// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const BIT_BLUE = '#005BBB';

// --- V NEW: A dedicated, clean theme for the Welcome Page ---
let landingPageTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BIT_BLUE,
    },
    background: {
      default: '#f8f9fa', // The light grey background for the page
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 800,
    },
    h6: {
      lineHeight: 1.6,
    }
  },
  shape: {
    borderRadius: 12,
  },
});
landingPageTheme = responsiveFontSizes(landingPageTheme);
export { landingPageTheme };
// --- ^ END NEW ---


// --- Your existing theme for the rest of the app ---
// Note: I've removed the global MuiPaper override from here as well,
// as it's better to apply glass styles on a case-by-case basis.
function makeTheme(mode) {
  const isDark = mode === 'dark';
  const base = createTheme({
    palette: {
      mode,
      primary: {
        main: BIT_BLUE,
      },
      background: {
        default: isDark ? '#121212' : '#f0f2f5',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 16,
    },
  });
  return responsiveFontSizes(base);
}

export const lightTheme = makeTheme('light');
export const darkTheme = makeTheme('dark');