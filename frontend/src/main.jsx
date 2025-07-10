// src/main.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";               // ← import BrowserRouter
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function Root() {
  const [dark, setDark] = useState(false);
  const theme = dark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>                                           {/* ← wrap here */}
        {/* Theme toggle */}
        <IconButton
          onClick={() => setDark((d) => !d)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "background.paper",
            boxShadow: 3,
            "&:hover": { boxShadow: 6 },
            zIndex: theme.zIndex.tooltip,
          }}
        >
          {dark ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* All your <Routes> in App will now work */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
