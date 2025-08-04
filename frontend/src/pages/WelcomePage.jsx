// src/pages/WelcomePage.jsx
import React from 'react';
import { Box, Typography, Button, Grid, Paper, Stack, Container, ThemeProvider, Chip, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { landingPageTheme } from '../theme';

// --- Icon Imports ---
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ArticleIcon from '@mui/icons-material/Article';

// --- Hero Section Component ---
const HeroSection = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', pt: 12, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center" sx={{ minHeight: { md: 'calc(100vh - 96px)' } }}>

          {/* Left Column: Text Content */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                <Typography component="h1" variant="h2" fontWeight={800} sx={{ textAlign: { xs: 'center', md: 'left' }, letterSpacing: '-1px' }}>
                  Streamline Your Academic Reporting
                </Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '500px', textAlign: { xs: 'center', md: 'left' } }}>
                  The official portal for the Bhilai Institute of Technology, Durg, to centralize, manage, and analyze quarterly academic activities.
                </Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}>
                <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/login')} sx={{ borderRadius: 999, px: 4, py: 1.5, textTransform: 'none', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0, 123, 255, 0.25)' }}>
                  Launch Portal
                </Button>
              </motion.div>
            </Stack>
          </Grid>

          {/* Right Column: Corrected App UI Mockup Visual */}
          <Grid item xs={12} md={6}>
            {/* --- V THIS IS THE CORRECTED LAYOUT --- */}
            <Box sx={{
              height: { xs: 400, sm: 500 },
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gridTemplateRows: 'repeat(10, 1fr)',
            }}>

              <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} style={{ gridArea: '2 / 4 / 7 / 11', zIndex: 1 }}>
                <Paper elevation={8} sx={{ borderRadius: 3, p: 2, background: 'white', height: '100%' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Department Analytics</Typography>
                  <Stack spacing={1}>
                    <Box><Typography variant="caption" color="text.secondary">CSE</Typography><LinearProgress variant="determinate" value={80} /></Box>
                    <Box><Typography variant="caption" color="text.secondary">MECH</Typography><LinearProgress variant="determinate" value={60} color="secondary" /></Box>
                    <Box><Typography variant="caption" color="text.secondary">MCA</Typography><LinearProgress variant="determinate" value={90} color="success" /></Box>
                  </Stack>
                </Paper>
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} style={{ gridArea: '1 / 1 / 5 / 8', zIndex: 2 }}>
                <Paper elevation={12} sx={{ borderRadius: 3, p: 2, background: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><ArticleIcon color="primary"/><Box><Typography variant="body1" fontWeight="bold">New Publication</Typography><Typography variant="caption" color="text.secondary">T1.1 Research Article</Typography></Box></Box>
                  <Button variant="contained" size="small" sx={{ mt: 2, borderRadius: 99 }}>Submit</Button>
                </Paper>
              </motion.div>

              <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} style={{ gridArea: '5 / 2 / 11 / 10', zIndex: 3 }}>
                <Paper elevation={16} sx={{ borderRadius: 3, p: 2.5, background: 'white', height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>User Management</Typography>
                  <Stack spacing={1}>
                    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}><Typography variant="body2">admin</Typography><Chip label="Active" color="success" size="small" /></Paper>
                    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}><Typography variant="body2">faculty_user</Typography><Chip label="Active" color="success" size="small" /></Paper>
                  </Stack>
                </Paper>
              </motion.div>

            </Box>
            {/* --- ^ END CORRECTION --- */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// --- Features Section Component ---
const features = [
    { icon: <CloudUploadIcon fontSize="large" />, title: 'Centralized Reporting', description: 'A single, unified platform for all faculty to submit quarterly reports.' },
    { icon: <SupervisorAccountIcon fontSize="large" />, title: 'Role-Based Access', description: 'Secure roles for Faculty, HODs, and Admins to ensure data integrity.' },
    { icon: <BarChartIcon fontSize="large" />, title: 'Data Analytics', description: 'Visualize submission data with an integrated analytics dashboard.' },
];
  
const FeatureCard = ({ icon, title, description }) => (
    <Grid item xs={12} md={4}>
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
          <Typography variant="h5" component="h3" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
          <Typography variant="body1" color="text.secondary">{description}</Typography>
        </Box>
      </motion.div>
    </Grid>
);
  
const FeaturesSection = () => (
    <Box sx={{ py: 12, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight={800} sx={{ mb: 2 }}>Built for Academic Excellence</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Our platform provides the tools necessary for efficient data collection and insightful analysis.
          </Typography>
        </Box>
        <Grid container spacing={5}>
          {features.map((feature, index) => <FeatureCard key={index} {...feature} />)}
        </Grid>
      </Container>
    </Box>
);

// --- Main Welcome Page Component ---
export default function WelcomePage() {
  return (
    <ThemeProvider theme={landingPageTheme}>
      <HeroSection />
      <FeaturesSection />
    </ThemeProvider>
  );
}