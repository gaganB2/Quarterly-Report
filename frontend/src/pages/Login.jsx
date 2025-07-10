// src/pages/Login.jsx
import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginLanding() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* AppBar */}
      <Box
        component="header"
        sx={{
          height: 64,
          bgcolor: "#00206a",
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <Box component="img" src="/assets/logo.png" alt="BIT Logo" sx={{ height: 40 }} />
        <Typography variant="h6" textAlign="center" flexGrow={1}>
          BHILAI INSTITUTE OF TECHNOLOGY, DURG
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left: Login as panel */}
        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 5,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: 4,
              }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Login As
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, px: 6 }}
                onClick={() => navigate("/login/faculty")}
              >
                Faculty
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{ px: 6 }}
                onClick={() => navigate("/login/admin")}
              >
                Admin
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Right: Guidelines panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "linear-gradient(to bottom right, #e3f2fd, #fff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Important Guidelines
            </Typography>
            <ul style={{ fontSize: "0.95rem", paddingLeft: "1.2rem" }}>
              <li>Do not fill data in the first Excel sheet.</li>
              <li>No cell should be left blank — use "Nil" or "NA".</li>
              <li>Submit unique document links per row.</li>
              <li>Do not merge cells while entering data.</li>
              <li>Submission deadline: 10th of next month after quarter end.</li>
              <li>Follow the official report format strictly.</li>
              <li>Club heads email their data directly to enumerator@bitdurg.ac.in</li>
            </ul>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
