// src/pages/StudentLoginPage.jsx

import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import logo from "/assets/favicon.png";

const MotionPaper = motion(Paper);

export default function StudentLoginPage() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setLoginError("");

    try {
      const loggedInUser = await login(creds.username, creds.password);

      // Ensure the user has the 'Student' role.
      if (loggedInUser.role !== 'Student') {
        setLoginError("This login is for students only. Please use the main login page for other roles.");
        return; 
      }
      
      // FIX: Removed the incorrect check for `password_changed`.
      // Students set their own password, so they are never forced to change it.
      // After a successful login, they are always sent to their dashboard.
      navigate("/student/dashboard");

    } catch (error) {
      console.error("Login failed:", error);
      const errorDetail = error.response?.data?.detail;
      if (errorDetail && errorDetail.includes("No active account")) {
        setLoginError("This account is not active. Please check your email for a verification link.");
      } else {
        setLoginError("Invalid Admission/Roll No. or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <MotionPaper
          elevation={12}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img src={logo} alt="BIT Durg Logo" style={{ height: 60, marginBottom: '16px' }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Student Portal Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Access your quarterly report dashboard.
          </Typography>

          <Stack
            spacing={2}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {loginError && <Alert severity="error">{loginError}</Alert>}

            <TextField
              name="username"
              label="Admission/Roll No."
              fullWidth
              value={creds.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={creds.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>

            <Typography variant="body2" sx={{ pt: 2 }}>
              Don't have an account?{" "}
              <Link component={RouterLink} to="/signup" fontWeight="bold">
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </MotionPaper>
      </Container>
    </Box>
  );
}
