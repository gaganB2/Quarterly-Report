// src/pages/LoginPage.jsx
// This is the refactored and renamed version of LoginLanding.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  CircularProgress,
  CssBaseline,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import logo from '/assets/logo.png';

const MotionPaper = motion(Paper);

export default function LoginPage() {
  const [role, setRole] = useState('faculty');
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); // Use the new login function from our context

  const validate = () => {
    const e = {};
    if (!creds.username.trim()) e.username = 'Username cannot be blank';
    if (creds.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- V MODIFIED: SIMPLIFIED LOGIN HANDLER ---
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setLoginError('');

    try {
      // The AuthContext now handles everything: API call, token storage, and user state.
      const loggedInUser = await login(creds.username, creds.password);
      
      // After a successful login, navigate based on the user's role.
      if (loggedInUser.role === 'Admin') {
        navigate('/admin/users');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error("Login failed:", error);
      // The AuthContext re-throws the error, so we can display a generic message.
      setLoginError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // --- ^ END MODIFIED ---

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };


  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 100px)',
        background: 'linear-gradient(-45deg, #74ebd5, #ACB6E5, #fbc2eb, #a6c1ee)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 20s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CssBaseline />
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.1}>
            <MotionPaper
              elevation={6}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              sx={{
                flex: 1, p: { xs: 3, md: 5 }, borderRadius: 4,
                backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center',
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="BIT-DURG"
                sx={{
                  height: 60, mb: 3,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: 'Roboto Slab, serif', color: '#002f6c' }}
              >
                BHILAI INSTITUTE OF TECHNOLOGY, DURG
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
                Quarterly Academic Activity Reporting System
              </Typography>
            </MotionPaper>
          </Tilt>
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.1}>
            <MotionPaper
              elevation={6}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              sx={{
                flex: 1, p: { xs: 3, md: 5 }, borderRadius: 4,
                backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.25)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}
            >
              <Typography variant="h6" align="center" fontWeight={700} gutterBottom>
                Login as
              </Typography>
              <Tabs
                id="toggle-tabs"
                value={role}
                onChange={(_, v) => setRole(v)}
                textColor="primary"
                indicatorColor="primary"
                centered
                sx={{ mb: 3 }}
              >
                <Tab label="Faculty" value="faculty" />
                <Tab label="Admin" value="admin" />
              </Tabs>
              <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                {loginError && <Alert severity="error">{loginError}</Alert>}
                <TextField
                  id="username-field"
                  name="username"
                  label={role === 'faculty' ? 'Faculty ID / Username' : 'Admin Username'}
                  fullWidth
                  variant="filled"
                  value={creds.username}
                  error={!!errors.username}
                  helperText={errors.username}
                  onChange={handleChange}
                />
                <TextField
                  id="password-field"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="filled"
                  value={creds.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={handleChange}
                />
                <Button
                  id="login-button"
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ borderRadius: 9999 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                </Button>
              </Stack>
            </MotionPaper>
          </Tilt>
        </Box>
      </Container>
    </Box>
  );
}