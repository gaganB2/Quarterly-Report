// src/pages/LoginLanding.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Collapse,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CssBaseline
} from '@mui/material';
import { DarkMode, LightMode, Settings, Contrast } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Joyride, { STATUS } from 'react-joyride';

// Motion-enhanced Paper
const MotionPaper = motion(Paper);

export default function LoginLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // derive our colors from the theme plus contrast toggle
  const bgGradient = darkMode
    ? 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'
    : 'linear-gradient(135deg,#e0f7fa,#e8f5e9)';
  const palette = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    text: highContrast ? '#FFF' : theme.palette.text.primary,
    panelBg: highContrast
      ? 'rgba(0,0,0,0.4)'
      : 'rgba(255,255,255,0.2)',
  };

  // Onboarding tour
  const [runTour, setRunTour] = useState(true);
  const steps = [
    { target: '#toggle-tabs', content: 'Toggle between Faculty and Admin here.' },
    { target: '#id-field', content: 'Type your ID here.' },
    { target: '#password-field', content: 'Type your password here.' },
    { target: '#advanced-button', content: 'Reveal extra options.' },
    { target: '#login-button', content: 'Press to log in.' },
  ];
  const onTourCallback = (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      setRunTour(false);
    }
  };

  // Storage toggles
  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Form state
  const [role, setRole] = useState('faculty');
  const [creds, setCreds] = useState({ id: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Validation
  const validate = () => {
    const e = {};
    if (!creds.id.trim()) e.id = 'ID cannot be blank';
    if (creds.password.length < 6) e.password = 'Password must be ≥6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Login click
  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => (window.location.href = '/home'), 800);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: bgGradient }}>
      <CssBaseline />

      {/* Joyride Tour */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        callback={onTourCallback}
        styles={{ options: { zIndex: 2000 } }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          {/* Hero */}
          <MotionPaper
            elevation={4}
            whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
            transition={{ duration: 0.3 }}
            sx={{
              flex: 7,
              p: isMobile ? 3 : 6,
              borderRadius: 3,
              backdropFilter: 'blur(12px)',
              bgcolor: palette.panelBg,
            }}
          >
            <Typography variant="h4" fontWeight={700} color={palette.primary} gutterBottom>
              BHILAI INSTITUTE OF TECHNOLOGY, DURG
            </Typography>
            <Typography variant="subtitle1" color={palette.text} sx={{ lineHeight: 1.6 }}>
              Quarterly Academic Activity Reporting System
            </Typography>
          </MotionPaper>

          {/* Login */}
          <MotionPaper
            elevation={4}
            whileHover={{ scale: 1.02, rotateX: -3, rotateY: 3 }}
            transition={{ duration: 0.3 }}
            sx={{
              flex: 5,
              p: isMobile ? 3 : 5,
              borderRadius: 3,
              backdropFilter: 'blur(12px)',
              bgcolor: palette.panelBg,
              position: 'sticky',
              top: theme.mixins.toolbar.minHeight + 16,
              border: `2px solid ${palette.primary}`,
            }}
          >
            {/* Toggles */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton onClick={() => setDarkMode(d => !d)} aria-label="Toggle theme">
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton onClick={() => setHighContrast(h => !h)} aria-label="Toggle contrast">
                <Contrast />
              </IconButton>
            </Box>

            <Typography variant="h5" fontWeight={700} align="center" gutterBottom color={palette.text}>
              Login as
            </Typography>

            {/* Role Tabs (sliding indicator) */}
            <Tabs
              id="toggle-tabs"
              value={role}
              onChange={(_, v) => setRole(v)}
              textColor="secondary"
              indicatorColor="secondary"
              variant="fullWidth"
              sx={{
                mb: 3,
                '& .MuiTabs-indicator': { height: 3, borderRadius: 3 },
                '& .MuiTab-root': {
                  color: palette.text,
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: '#fff',
                },
              }}
            >
              <Tab label="Faculty" value="faculty" />
              <Tab label="Admin" value="admin" />
            </Tabs>

            {/* Inputs */}
            <Stack spacing={2}>
              <TextField
                id="id-field"
                label={role === 'faculty' ? 'Faculty ID' : 'Admin ID'}
                variant="filled"
                fullWidth
                error={!!errors.id}
                helperText={errors.id}
                value={creds.id}
                onChange={e => setCreds(c => ({ ...c, id: e.target.value }))}
                InputProps={{
                  sx: {
                    backgroundColor: highContrast ? '#222' : '#fff',
                  },
                }}
              />
              <TextField
                id="password-field"
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                value={creds.password}
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                InputProps={{
                  sx: {
                    backgroundColor: highContrast ? '#222' : '#fff',
                  },
                }}
              />

              {/* Log In */}
              <Button
                id="login-button"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{
                  bgcolor: palette.primary,
                  '&:hover': {
                    bgcolor: palette.secondary,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>
            </Stack>

            {/* Advanced Options */}
            <Box mt={2}>
              <Button
                id="advanced-button"
                size="small"
                onClick={() => setShowAdvanced(a => !a)}
                sx={{ textTransform: 'none', color: palette.primary }}
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>
              <Collapse in={showAdvanced} sx={{ mt: 1 }}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox sx={{ color: palette.text }} />}
                    label="Remember me"
                    sx={{ color: palette.text }}
                  />
                </FormGroup>
                <Typography variant="body2" color={palette.text}>
                  Forgot password?{' '}
                  <Box
                    component="a"
                    href="#"
                    sx={{ color: palette.primary, textDecoration: 'underline' }}
                  >
                    Reset here
                  </Box>
                  .
                </Typography>
              </Collapse>
            </Box>

            {/* Guidelines */}
            <Box mt={3}>
              <Button
                startIcon={<Settings />}
                size="small"
                onClick={() => setShowGuidelines(g => !g)}
                sx={{ textTransform: 'none', color: palette.primary }}
              >
                {showGuidelines ? 'Hide' : 'Show'} Guidelines
              </Button>
              <Collapse in={showGuidelines} sx={{ mt: 1 }}>
                <Typography variant="body2" color={palette.text} sx={{ lineHeight: 1.6 }}>
                  • Do not fill data in the first Excel sheet.<br />
                  • No cell should be left blank — use “Nil” or “NA”.<br />
                  • Submit unique document links per row.<br />
                  • Do not merge cells when entering data.<br />
                  • Submission deadline: 10th of next month.<br />
                  • Email to{' '}
                  <Box
                    component="a"
                    href="mailto:enumerator@bitdurg.ac.in"
                    sx={{ color: palette.primary, textDecoration: 'underline' }}
                  >
                    enumerator@bitdurg.ac.in
                  </Box>
                  .
                </Typography>
              </Collapse>
            </Box>
          </MotionPaper>
        </Box>
      </Container>
    </Box>
  );
}
