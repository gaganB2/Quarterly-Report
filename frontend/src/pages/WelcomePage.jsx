// src/pages/WelcomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Stack, 
  Container, 
  ThemeProvider, 
  Chip, 
  LinearProgress, 
  Avatar, 
  Badge,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// --- ICON IMPORTS (CORRECTED AND CONSOLIDATED) ---
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Business as BusinessIcon } from '@mui/icons-material'; // CORRECT, SINGLE IMPORT

// --- ENHANCED THEME CONFIGURATION ---
let landingPageTheme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontFamily: '"Inter", sans-serif', 
      fontWeight: 800,
      letterSpacing: '-0.02em'
    },
    h2: { 
      fontFamily: '"Inter", sans-serif', 
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h3: { 
      fontFamily: '"Inter", sans-serif', 
      fontWeight: 700 
    },
    h4: { 
      fontFamily: '"Inter", sans-serif', 
      fontWeight: 600 
    },
    h5: { 
      fontFamily: '"Inter", sans-serif', 
      fontWeight: 600 
    },
  },
  palette: {
    primary: { 
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5'
    },
    secondary: { 
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0d9488'
    },
    text: { 
      primary: '#0f172a',
      secondary: '#64748b'
    },
    background: { 
      default: '#ffffff', 
      paper: '#ffffff' 
    },
    success: { main: '#22c55e' },
    error: { main: '#ef4444' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        }
      }
    }
  }
});
landingPageTheme = responsiveFontSizes(landingPageTheme);

// --- HERO SECTION COMPONENT ---
const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const dashboardData = [
    {
      title: "Active Users",
      value: "147",
      icon: <GroupIcon />,
      trend: "+12%",
      color: "#6366f1"
    },
    {
      title: "Reports This Quarter",
      value: "324",
      icon: <AssignmentIcon />,
      trend: "+28%",
      color: "#14b8a6"
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      icon: <TrendingUpIcon />,
      trend: "+5.2%",
      color: "#f59e0b"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, md: 0 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          animation: 'float 20s infinite ease-in-out',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column - Text Content */}
          <Grid item xs={12} lg={6}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Stack spacing={4} sx={{ maxWidth: { xs: '100%', lg: '90%' } }}>
                <motion.div variants={itemVariants}>
                  <Typography
                    component="h1"
                    variant="h1"
                    sx={{
                      color: 'white',
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      lineHeight: 1.1,
                      textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                      mb: 2
                    }}
                  >
                    Transform Your
                    <Box component="span" sx={{ display: 'block', color: '#fbbf24' }}>
                      Academic Reporting
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: '500px'
                    }}
                  >
                    The comprehensive digital platform for Bhilai Institute of Technology, 
                    streamlining quarterly reports with intelligent analytics and seamless collaboration.
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/login')}
                      sx={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }
                      }}
                    >
                      Launch Portal
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        backdrop: 'blur(10px)',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.5)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </motion.div>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right Column - Dashboard Preview */}
          <Grid item xs={12} lg={6}>
            <motion.div
              style={{ y }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Main Dashboard Card */}
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                      Analytics Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Real-time insights and reporting metrics
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {dashboardData.map((item, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Card
                            elevation={2}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                              border: `1px solid ${item.color}20`
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mb: 2,
                                mx: 'auto'
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                              {item.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.trend}
                              size="small"
                              sx={{
                                backgroundColor: '#22c55e20',
                                color: '#22c55e',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            />
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Progress Bars */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" color="text.primary" gutterBottom>
                      Department Progress
                    </Typography>
                    <Stack spacing={2}>
                      {[
                        { name: 'Computer Science', progress: 92, color: '#6366f1' },
                        { name: 'Mechanical', progress: 87, color: '#14b8a6' },
                        { name: 'MCA', progress: 96, color: '#f59e0b' }
                      ].map((dept, index) => (
                        <Box key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {dept.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="text.primary">
                              {dept.progress}%
                            </Typography>
                          </Box>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dept.progress}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.2 }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: `${dept.color}20`,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: dept.color,
                                  borderRadius: 4
                                }
                              }}
                            />
                          </motion.div>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    zIndex: 10
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CheckCircleIcon />
                    <Typography variant="body2" fontWeight="bold">
                      98% Uptime
                    </Typography>
                  </Paper>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '-20px',
                    zIndex: 10
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <NotificationsIcon />
                    <Typography variant="body2" fontWeight="bold">
                      5 New Reports
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// --- FEATURES SECTION COMPONENT ---
const FeaturesSection = () => {
  const features = [
    {
      icon: <CloudUploadIcon fontSize="large" />,
      title: 'Smart Document Management',
      description: 'Advanced file handling with automated categorization, version control, and intelligent search capabilities.',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    },
    {
      icon: <SupervisorAccountIcon fontSize="large" />,
      title: 'Role-Based Workflows',
      description: 'Sophisticated permission system with customizable roles, approval chains, and automated notifications.',
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
    },
    {
      icon: <AnalyticsIcon fontSize="large" />,
      title: 'Advanced Analytics',
      description: 'Interactive dashboards, predictive insights, and comprehensive reporting with exportable visualizations.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Container maxWidth="lg">
        <Stack spacing={8} alignItems="center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: '800px' }}>
              <Typography
                component="h2"
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                Powerful Features for Modern Academia
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 400, lineHeight: 1.7 }}
              >
                Experience the next generation of academic management with intelligent automation,
                seamless collaboration, and data-driven insights.
              </Typography>
            </Stack>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: feature.color,
                        boxShadow: `0 25px 50px -12px ${feature.color}25`,
                        transform: 'translateY(-5px)',
                        '& .feature-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                        '&::before': {
                          opacity: 1,
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: feature.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }
                    }}
                  >
                    <Stack spacing={3} alignItems="center" textAlign="center" height="100%">
                      <Box
                        className="feature-icon"
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 4,
                          background: feature.gradient,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 20px 40px -15px ${feature.color}50`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.7,
                            flexGrow: 1
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Stack>

                      <IconButton
                        sx={{
                          mt: 2,
                          color: feature.color,
                          backgroundColor: `${feature.color}10`,
                          '&:hover': {
                            backgroundColor: `${feature.color}20`,
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

// --- STATS SECTION COMPONENT ---
const StatsSection = () => {
  const stats = [
    { number: '150+', label: 'Active Faculty', icon: <GroupIcon /> },
    { number: '12', label: 'Departments', icon: <BusinessIcon /> },
    { number: '1,200+', label: 'Reports Generated', icon: <AssignmentIcon /> },
    { number: '99.9%', label: 'System Uptime', icon: <TrendingUpIcon /> }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Trusted by Academia
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Join thousands of educators who trust our platform for streamlined academic reporting
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Box
                    sx={{
                      color: '#6366f1',
                      mb: 2,
                      fontSize: '2rem'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h2"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      color: 'text.primary',
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      lineHeight: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      mt: 1
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// --- ABOUT SECTION COMPONENT ---
const AboutSection = () => {
  const benefits = [
    {
      icon: <SecurityIcon />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security protocols protect your sensitive academic data.'
    },
    {
      icon: <AutoAwesomeIcon />,
      title: 'AI-Powered Insights',
      description: 'Machine learning algorithms provide predictive analytics and intelligent recommendations.'
    },
    {
      icon: <GroupIcon />,
      title: 'Seamless Collaboration',
      description: 'Built-in communication tools foster teamwork between faculty, departments, and administration.'
    }
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#ffffff' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Stack spacing={4}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  The Future of Academic Management
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.7
                  }}
                >
                  Our platform revolutionizes how educational institutions handle quarterly reporting,
                  making complex processes simple and data-driven decisions effortless.
                </Typography>

                <Stack spacing={3}>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 56,
                            height: 56,
                            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)'
                          }}
                        >
                          {benefit.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
                          >
                            {benefit.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                          >
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ position: 'relative' }}>
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                    System Overview
                  </Typography>
                  
                  <Stack spacing={3} sx={{ mt: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          System Performance
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          Excellent
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={96}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#22c55e',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          User Satisfaction
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          98.5%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={98.5}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#6366f1',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Data Accuracy
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          99.9%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={99.9}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#14b8a6',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>

                {/* Floating notification */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '-20px'
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: 'white',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 180
                    }}
                  >
                    <CheckCircleIcon />
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', opacity: 0.9 }}>
                        Live Update
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Report Submitted
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// --- CALL TO ACTION SECTION ---
const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Stack spacing={4} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 2
              }}
            >
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}
            >
              Ready to Transform Your Institution?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '600px',
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Join the digital revolution in academic management. Experience seamless reporting,
              intelligent analytics, and enhanced collaboration today.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.6)',
                  }
                }}
              >
                Get Started Free
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Schedule Demo
              </Button>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

// --- FOOTER COMPONENT ---
const Footer = () => (
  <Box
    component="footer"
    sx={{
      background: '#0f172a',
      color: '#94a3b8',
      py: 8
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography
              variant="h5"
              sx={{ color: 'white', fontWeight: 700 }}
            >
              BIT Durg Academic Portal
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '400px', lineHeight: 1.7 }}>
              Empowering academic excellence through innovative technology and streamlined processes
              at Bhilai Institute of Technology, Durg.
            </Typography>
            <Typography variant="body2">
              Bhilai House, Durg, Chhattisgarh 491001
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            {['Dashboard', 'Reports', 'Analytics', 'Support'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#6366f1' }
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Support
          </Typography>
          <Stack spacing={1}>
            {['Documentation', 'Help Center', 'Contact Us', 'System Status'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#6366f1' }
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          borderTop: '1px solid #334155',
          mt: 6,
          pt: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Bhilai Institute of Technology, Durg. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

// --- MAIN COMPONENT ---
export default function WelcomePage() {
  return (
    <ThemeProvider theme={landingPageTheme}>
      <Box sx={{ minHeight: '100vh' }}>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <AboutSection />
        <CallToActionSection />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}