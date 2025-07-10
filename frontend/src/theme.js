import { createTheme } from "@mui/material/styles";

const base = {
  typography: {
    fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
    h1: { fontFamily: `"Inter",sans-serif`, fontWeight: 700 },
    h2: { fontFamily: `"Inter",sans-serif`, fontWeight: 700 },
    h3: { fontFamily: `"Inter",sans-serif`, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F5F7FA", margin: 0, padding: 0 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            transition: "border-color 0.3s",
            "&:hover fieldset": { borderColor: "#4285F4" },
            "&.Mui-focused fieldset": { borderColor: "#4285F4" },
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...base,
  palette: {
    mode: "light",
    primary: { main: "#4285F4", contrastText: "#fff" },
    secondary: { main: "#34A853", contrastText: "#fff" },
    error: { main: "#EA4335" },
    warning: { main: "#FBBC05" },
    background: { default: "#F5F7FA", paper: "#fff" },
  },
});

export const darkTheme = createTheme({
  ...base,
  palette: {
    mode: "dark",
    primary: { main: "#8AB4F8", contrastText: "#000" },
    secondary: { main: "#AECBFA", contrastText: "#000" },
    background: { default: "#121212", paper: "#1E1E1E" },
  },
});
