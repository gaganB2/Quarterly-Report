// src/layout/MainLayout.jsx
import React from "react";
import { Box, Typography, AppBar, Toolbar, CssBaseline } from "@mui/material";
import logo from "/assets/logo.png"; // adjust path if needed

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <CssBaseline />
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#2c7be5",
          color: "white",
          boxShadow: "none",
          borderBottom: "1px solid #dbe4f3",
        }}
      >
        <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
          <img src={logo} alt="BIT Logo" height={36} style={{ marginRight: 12 }} />
          <Typography variant="h6" noWrap>
            BIT Durg Quarterly Reporting
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box component="main" sx={{ p: 4, flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
