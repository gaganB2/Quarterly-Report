import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Alert,
  CircularProgress,
  Link,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import { Visibility, VisibilityOff, School, AdminPanelSettings, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/favicon.png";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axios";
import { useSnackbar } from "notistack";

const auroraVibrant = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const panX = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const colorPurple = '#8B5CF6';
const colorBlue = '#4A00E0';

export default function LoginPage() {
  const [role, setRole] = useState("faculty");
  const [showPassword, setShowPassword] = useState(false);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showResendLink, setShowResendLink] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoginError("");
    setShowResendLink(false);
  }, [role]);

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    setShowResendLink(false);
    try {
      const loggedInUser = await login(creds.username, creds.password);
      if (loggedInUser.password_changed === false) {
        navigate("/force-password-change");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      if (errorDetail?.includes("No active account")) {
        setLoginError("This account is not active. Please check your email for a verification link.");
        setShowResendLink(true);
      } else {
        setLoginError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!creds.username) {
        enqueueSnackbar("Please enter your Faculty ID in the username field first.", { variant: 'warning' });
        return;
    }
    setLoading(true);
    try {
        await apiClient.post('/api/resend-verification/', { username: creds.username });
        enqueueSnackbar("A new verification link has been sent. Please check the email associated with your account.", { variant: 'success' });
        setShowResendLink(false);
        setLoginError(""); // Clear the old error message
    } catch (err) {
        enqueueSnackbar("An error occurred while resending the email. Please try again.", { variant: 'error' });
    } finally {
        setLoading(false);
    }
  };

  const baseButtonStyles = {
    borderRadius: '99px',
    fontWeight: 700,
    textTransform: "none",
    fontSize: "1rem",
    color: 'white',
    background: `linear-gradient(45deg, ${colorBlue}, ${colorPurple})`,
    backgroundSize: '150% 150%',
    transition: 'background-position 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: `0 4px 15px -5px ${alpha(colorBlue, 0.7)}`,
    '&:hover': {
      transform: 'translateY(-3px)',
      backgroundPosition: '100% 50%',
      boxShadow: `0 6px 20px -5px ${alpha(colorPurple, 0.7)}`,
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        background: `linear-gradient(125deg, #F9F7FF, #E0F7FF, #FFF5E1, #FEDEFF, #F9F7FF)`,
        backgroundSize: '400% 400%',
        animation: `${auroraVibrant} 30s ease infinite`,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
          alignItems: "center",
          gap: { xs: 6, lg: 12 },
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Stack 
            spacing={3}
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box component="img" src={logo} alt="BIT-DURG" sx={{ height: 40 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.secondary" }}>
                Quarterly Report Management System
              </Typography>
            </Box>
            <Typography sx={{
              fontWeight: 800,
              fontSize: '5rem',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              background: `linear-gradient(135deg, ${colorBlue} 15%, ${colorPurple} 50%, #111827 85%)`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${panX} 8s ease-in-out infinite`,
            }}>
              Academic Reporting
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 450, fontWeight: 400, lineHeight: 1.6 }}>
              Sign in to continue your academic journey with a secure and modern reporting system.
            </Typography>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              mx: 'auto',
              p: { xs: 3, sm: 5 },
              borderRadius: 5,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(16px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, textAlign: "center", color: "text.primary" }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}>
              Sign in to the Institute Portal
            </Typography>

            <Stack component="form" onSubmit={handleLogin} spacing={2.5}>
              <Box sx={{ position: 'relative', display: 'flex', p: 0.5, backgroundColor: '#e0e0e0', borderRadius: '50px' }}>
                <motion.div
                  layoutId="role-glider-light"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    bottom: '4px',
                    width: 'calc(50% - 4px)',
                    left: role === 'faculty' ? '4px' : 'calc(50% + 4px)',
                    background: `linear-gradient(45deg, ${colorBlue}, ${colorPurple})`,
                    borderRadius: '50px',
                    boxShadow: `0 3px 10px ${alpha(colorPurple, 0.3)}`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
                <Button fullWidth onClick={() => setRole('faculty')} sx={{ zIndex: 1, color: role === 'faculty' ? 'white' : 'text.primary', fontWeight: 600, textTransform: 'none', py:1.25 }}>
                  <School sx={{ mr: 1, fontSize: 20 }} /> Faculty
                </Button>
                <Button fullWidth onClick={() => setRole('admin')} sx={{ zIndex: 1, color: role === 'admin' ? 'white' : 'text.primary', fontWeight: 600, textTransform: 'none', py:1.25 }}>
                  <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} /> Admin
                </Button>
              </Box>

              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Alert
                      severity="error"
                      variant="filled"
                      action={
                        showResendLink && (
                          <Button color="inherit" size="small" onClick={handleResendVerification} disabled={loading}>
                            Resend Email
                          </Button>
                        )
                      }
                    >
                      {loginError}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <TextField name="username" label="Faculty ID" value={creds.username} onChange={handleChange} />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={creds.password}
                onChange={handleChange}
                InputProps={{
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

              <Button type="submit" fullWidth disabled={loading} sx={{ ...baseButtonStyles, py: 1.5, mt: 1 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                {!loading && <ArrowForward sx={{ ml: 1 }} />}
              </Button>

              <Typography variant="body2" align="center" sx={{ pt: 2 }}>
                Are you a student?{" "}
                <Link component={RouterLink} to="/login/student" fontWeight="bold">
                  Login Here
                </Link>
              </Typography>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}