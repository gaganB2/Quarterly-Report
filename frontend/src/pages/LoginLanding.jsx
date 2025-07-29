// src/pages/LoginLanding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Collapse,
  Stack,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CssBaseline,
  Alert, // Import Alert for showing errors
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import Joyride, { STATUS } from 'react-joyride';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import logo from '/assets/logo.png';

const MotionPaper = motion(Paper);

export default function LoginLanding() {
  const [role, setRole] = useState('faculty');
  const [creds, setCreds] = useState({ id: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(''); // State for API login errors
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Initialize useAuth hook

  const [runTour, setRunTour] = useState(true);
  const steps = [
    { target: '#toggle-tabs', content: 'Toggle between Faculty and Admin here.' },
    { target: '#id-field', content: 'Type your ID here.' },
    { target: '#password-field', content: 'Type your password here.' },
    { target: '#login-button', content: 'Press to log in.' },
  ];

  const handleTourCallback = (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      setRunTour(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!creds.id.trim()) e.id = 'ID cannot be blank';
    if (creds.password.length < 6) e.password = 'Password must be ≥6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setLoginError(''); // Reset previous errors

    try {
      // Make the actual API call to the Django backend
      const response = await apiClient.post('/api-token-auth/', {
        username: creds.id,
        password: creds.password,
      });

      // On success, the backend sends back a token
      const { token } = response.data;

      // Store the token in localStorage. The apiClient will now use it for all future requests.
      localStorage.setItem('token', token);

      // Call the login function from AuthContext to fetch the user's profile
      await login();

      // Now redirect to the home page
      navigate('/home');

    } catch (error) {
      // If the API call fails (e.g., wrong credentials)
      console.error("Login failed:", error.response?.data);
      if (error.response && error.response.status === 400) {
        setLoginError('Invalid username or password. Please try again.');
      } else {
        setLoginError('An unexpected error occurred. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #74ebd5, #ACB6E5, #fbc2eb, #a6c1ee)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 20s ease infinite',
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

      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        callback={handleTourCallback}
        styles={{ options: { zIndex: 2000 } }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
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
                flex: 1,
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="BIT-DURG"
                sx={{
                  height: 60,
                  mb: 3,
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
                flex: 1,
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
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

              <Stack spacing={2}>
                {/* Display API login errors here */}
                {loginError && <Alert severity="error">{loginError}</Alert>}
                
                <TextField
                  id="id-field"
                  label={role === 'faculty' ? 'Faculty ID' : 'Admin ID'}
                  fullWidth
                  variant="filled"
                  value={creds.id}
                  error={!!errors.id}
                  helperText={errors.id}
                  onChange={(e) => setCreds({ ...creds, id: e.target.value })}
                />
                <TextField
                  id="password-field"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="filled"
                  value={creds.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                />

                <Button
                  id="login-button"
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleLogin}
                  disabled={loading}
                  sx={{ borderRadius: 9999 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                </Button>
              </Stack>

              <Box mt={2} textAlign="center">
                <Button
                  id="advanced-button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </Button>
                <Collapse in={showAdvanced}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Remember me" />
                  </FormGroup>
                  <Typography variant="body2">
                    Forgot password? <Box component="a" href="#" sx={{ color: 'primary.main' }}>Reset here</Box>
                  </Typography>
                </Collapse>
              </Box>

              <Box mt={3} textAlign="center">
                <Button
                  startIcon={<Settings />}
                  onClick={() => setShowGuidelines(!showGuidelines)}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {showGuidelines ? 'Hide' : 'Show'} Guidelines
                </Button>
                <Collapse in={showGuidelines}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    • Do not fill data in the first Excel sheet.<br />
                    • No cell should be left blank — use “Nil” or “NA”.<br />
                    • Submit unique document links per row.<br />
                    • Do not merge cells when entering data.<br />
                    • Submission deadline: 10th of next month.<br />
                    • Email to{' '}
                    <Box
                      component="a"
                      href="mailto:enumerator@bitdurg.ac.in"
                      sx={{ color: 'primary.main', textDecoration: 'underline' }}
                    >
                      enumerator@bitdurg.ac.in
                    </Box>
                    .
                  </Typography>
                </Collapse>
              </Box>
            </MotionPaper>
          </Tilt>
        </Box>
      </Container>
    </Box>
  );
}