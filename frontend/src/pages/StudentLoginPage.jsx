// src/pages/StudentLoginPage.jsx

import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
  useTheme,
  alpha,
  keyframes,
  Divider, // --- FIX: Add Divider to the import list ---
} from "@mui/material";
import { Visibility, VisibilityOff, PersonOutline, LockOutlined, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/favicon.png";
import { useAuth } from "../context/AuthContext";

const auroraVibrant = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function StudentLoginPage() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const loggedInUser = await login(creds.username, creds.password);
      if (loggedInUser.role !== 'Student') {
        setLoginError("This login is for students only. Please use the main login page for other roles.");
        return; 
      }
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
        width: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: `linear-gradient(125deg, #E6F7FF, #EBF5FF, #F0F9FF, #F5F3FF, #E6F7FF)`,
        backgroundSize: '400% 400%',
        animation: `${auroraVibrant} 30s ease infinite`,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(16px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Box component="img" src={logo} alt="BIT-DURG Logo" sx={{ height: 50, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Student Portal Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access your report dashboard.
            </Typography>
          </Box>

          <Stack component="form" onSubmit={handleLogin} spacing={2.5}>
            <AnimatePresence>
              {loginError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Alert severity="error" variant="filled">{loginError}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <TextField
              name="username"
              label="Admission/Roll No."
              fullWidth
              value={creds.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><PersonOutline /></InputAdornment>),
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
                startAdornment: (<InputAdornment position="start"><LockOutlined /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', width: '100%', mt: -1.5 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.75, textTransform: 'none', fontSize: '1rem', fontWeight: 700, borderRadius: '99px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              {!loading && <ArrowForward sx={{ ml: 1 }} />}
            </Button>

            <Divider sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">New Here?</Typography>
            </Divider>

            <Button
              component={RouterLink}
              to="/signup"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '99px' }}
            >
              Create an Account
            </Button>
            
            <Typography variant="body2" align="center" sx={{ pt: 1 }}>
              Are you Faculty or Staff?{" "}
              <Link component={RouterLink} to="/login" fontWeight="bold">
                Login Here
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}