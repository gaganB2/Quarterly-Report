import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#5e35b1' },
          secondary: { main: '#ff7043' },
          background: { default: '#f5f5f5', paper: '#ffffff' },
        }
      : {
          primary: { main: '#8c9eff' },
          secondary: { main: '#ff8a65' },
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          transition: 'all 0.3s ease',
        },
      },
    },
  },
});