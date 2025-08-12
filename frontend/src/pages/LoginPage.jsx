// src/pages/LoginPage.jsx
// Modern, minimal, and premium login page design

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CssBaseline,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  School,
  AdminPanelSettings,
  ArrowForward,
  Security,
  Analytics,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/assets/logo.png";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Minimal floating elements
const BackgroundElements = () => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      zIndex: 0,
    }}
  >
    {/* Subtle geometric shapes */}
    <MotionBox
      sx={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <MotionBox
      sx={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
      }}
      animate={{
        scale: [1.1, 1, 1.1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </Box>
);

export default function LoginPage() {
  const [role, setRole] = useState("faculty");
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const validate = () => {
    const e = {};
    if (!creds.username.trim()) e.username = "Username cannot be blank";
    if (creds.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setLoginError("");

    try {
      const loggedInUser = await login(creds.username, creds.password);

      // Check if the user needs to change their password
      if (loggedInUser.password_changed === false) {
        navigate("/force-password-change"); // Redirect to the new page
      } else if (loggedInUser.role === "Admin") {
        navigate("/admin/users");
      } else {
        navigate("/home");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      // Check the specific error message from the backend
      const errorDetail = error.response?.data?.detail;
      if (errorDetail && errorDetail.includes("No active account")) {
        setLoginError(
          "This account is not active. Please check your email for a verification link."
        );
      } else {
        setLoginError("Invalid username or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const roleConfig = {
    faculty: {
      icon: <School sx={{ fontSize: 20 }} />,
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #047857)",
      label: "Faculty",
      description: "Academic Portal",
    },
    admin: {
      icon: <AdminPanelSettings sx={{ fontSize: 20 }} />,
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626, #b91c1c)",
      label: "Admin",
      description: "Control Panel",
    },
  };

  useEffect(() => {
    setErrors({});
    setLoginError("");
  }, [role]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background:
          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <BackgroundElements />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 6, lg: 12 },
            alignItems: "center",
            minHeight: { xs: "auto", lg: "80vh" },
          }}
        >
          {/* Left Section - Minimal Brand */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              textAlign: { xs: "center", lg: "left" },
            }}
          >
            {/* Clean Logo Section */}
            <Box>
              <MotionBox
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="BIT-DURG"
                    sx={{
                      height: { xs: 40, md: 48 },
                      filter: "brightness(1.2)",
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      lineHeight: 1.2,
                      opacity: 0.95,
                    }}
                  >
                    BIT-DURG
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Institute Portal
                  </Typography>
                </Box>
              </MotionBox>

              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 300,
                  color: "white",
                  lineHeight: 1.2,
                  mb: 2,
                  fontFamily: '"Inter", -apple-system, sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                Academic Reporting
                <Box
                  component="span"
                  sx={{ fontWeight: 700, display: "block" }}
                >
                  Made Simple
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 400,
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                Streamlined quarterly reporting system for academic excellence
                and institutional growth.
              </Typography>
            </Box>

            {/* Minimal Feature Pills */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<Security sx={{ fontSize: 16 }} />}
                  label="Enterprise Security"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                <Chip
                  icon={<Analytics sx={{ fontSize: 16 }} />}
                  label="Smart Analytics"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </Box>
            )}
          </MotionBox>

          {/* Right Section - Clean Login Form */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <MotionPaper
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: 420,
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ color: "#111827", mb: 1 }}
                >
                  Welcome back
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Sign in to your account
                </Typography>
              </Box>

              {/* Minimal Role Tabs */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    p: 0.5,
                    backgroundColor: "#f3f4f6",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      onClick={() => setRole(key)}
                      variant={role === key ? "contained" : "text"}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        background:
                          role === key ? config.gradient : "transparent",
                        color: role === key ? "white" : "#6b7280",
                        boxShadow:
                          role === key ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                        "&:hover": {
                          backgroundColor:
                            role === key ? undefined : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {config.icon}
                        {config.label}
                      </Box>
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Clean Form */}
              <Stack
                spacing={3}
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <AnimatePresence>
                  {loginError && (
                    <Fade in={!!loginError}>
                      <Alert
                        severity="error"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#dc2626",
                        }}
                      >
                        {loginError}
                      </Alert>
                    </Fade>
                  )}
                </AnimatePresence>

                <TextField
                  name="username"
                  label={role === "faculty" ? "Faculty ID" : "Admin Username"}
                  fullWidth
                  variant="outlined"
                  value={creds.username}
                  error={!!errors.username}
                  helperText={errors.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      "& fieldset": {
                        borderColor: "#e5e7eb",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: roleConfig[role].color,
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                      fontSize: "0.9rem",
                    },
                    "& .MuiInputBase-input": {
                      color: "#111827",
                      fontSize: "0.95rem",
                    },
                  }}
                />

                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={creds.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: "#9ca3af" }}
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      "& fieldset": {
                        borderColor: "#e5e7eb",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: roleConfig[role].color,
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                      fontSize: "0.9rem",
                    },
                    "& .MuiInputBase-input": {
                      color: "#111827",
                      fontSize: "0.95rem",
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  endIcon={
                    loading ? null : <ArrowForward sx={{ fontSize: 18 }} />
                  }
                  sx={{
                    py: 1.75,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background: roleConfig[role].gradient,
                    boxShadow: `0 4px 16px ${roleConfig[role].color}30`,
                    "&:hover": {
                      background: roleConfig[role].gradient,
                      transform: "translateY(-1px)",
                      boxShadow: `0 8px 25px ${roleConfig[role].color}40`,
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    },
                    "&:disabled": {
                      background: "#e5e7eb",
                      color: "#9ca3af",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    `Sign in`
                  )}
                </Button>
              </Stack>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                  }}
                >
                  Secured by enterprise-grade encryption
                </Typography>
              </Box>
            </MotionPaper>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}