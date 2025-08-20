import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  // FIXED: Added AppBar and Toolbar to the import list
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  keyframes,
} from '@mui/material';
import {
  ArrowForward,
  RocketLaunch,
  EditNote,
  Analytics,
  TrendingUp,
  ExpandMore,
} from '@mui/icons-material';

// --- KEYFRAMES ---
const auroraVibrant = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const flow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const panX = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 8px 25px -8px #4A00E0; }
  50% { transform: scale(1.03); box-shadow: 0 12px 30px -8px #8E2DE2; }
`;

// --- HOOKS & UTILITIES ---
const useInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    }, { ...options, triggerOnce: true });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options, ref]);
  return [ref, isInView];
};

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView({ threshold: 0.5 });
  useEffect(() => {
    if (isInView) {
      let startTime;
      const duration = 2500;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuint = 1 - Math.pow(1 - progress, 5);
        setCount(Math.floor(easeOutQuint * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
};


// --- Main Landing Page Component ---
export default function BITDurgLandingProfessional() {

  // --- START: WIDGET COMPONENTS (Now inside main component) ---
  const colorPurple = '#8B5CF6';
  const colorBlue = '#4A00E0';
  const colorOrange = '#FF9100';
  const colorSuccess = '#10b981';
  const colorDanger = '#ef4444';

  const OnboardingPreview = () => {
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current && window.anime) {
        window.anime({
            targets: ref.current.children,
            opacity: [0, 1],
            translateX: [-10, 0],
            delay: window.anime.stagger(1500, {start: 500}),
            loop: true, direction: 'alternate', duration: 1000, easing: 'easeInOutQuad'
        });
      }
    }, []);
    return (
      <Box ref={ref} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, opacity: 0 }}>
          <i className="fas fa-user-plus" style={{ color: colorPurple }}></i>
          <Typography variant="body2" sx={{fontWeight: 500, color: '#F9FAFB'}}>Admin Creates User</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, opacity: 0 }}>
          <i className="fas fa-envelope-open-text" style={{ color: colorPurple }}></i>
          <Typography variant="body2" sx={{fontWeight: 500, color: '#F9FAFB'}}>Email Verification</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, opacity: 0 }}>
          <i className="fas fa-key" style={{ color: colorPurple }}></i>
          <Typography variant="body2" sx={{fontWeight: 500, color: '#F9FAFB'}}>Set New Password</Typography>
        </Box>
      </Box>
    );
  };

  const FormListPreview = () => {
      const ref = useRef(null);
      useEffect(() => {
          if(ref.current && window.anime) {
              const forms = ['T6.5: AICTE Initiatives', 'T2.2: Workshops Organized', 'T1.1: Research Articles'];
              forms.forEach((form) => {
                  const item = document.createElement('div');
                  item.textContent = form;
                  Object.assign(item.style, {
                      background: '#2D3748', padding: '0.75rem', borderRadius: '8px',
                      marginBottom: '0.75rem', fontSize: '0.9rem', color: '#F9FAFB', fontWeight: '500'
                  });
                  ref.current.appendChild(item);
              });
          }
      }, [])
      return <Box ref={ref} sx={{width: '100%'}}></Box>
  }

  const AnalyticsPreview = () => {
      const ref = useRef(null);
      useEffect(() => {
          if(ref.current && window.anime) {
              window.anime({
                  targets: ref.current.children,
                  height: () => window.anime.random(20, 100) + '%',
                  opacity: () => window.anime.random(0.6, 1),
                  duration: 1500, easing: 'easeInOutQuad',
                  direction: 'alternate', loop: true,
                  delay: window.anime.stagger(200)
              });
          }
      }, [])
      return(
          <Box ref={ref} sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 100, width: '100%', justifyContent: 'space-evenly'}}>
              <Box sx={{width: 30, background: colorBlue, borderRadius: 1}}></Box>
              <Box sx={{width: 30, background: colorPurple, borderRadius: 1}}></Box>
              <Box sx={{width: 30, background: colorOrange, borderRadius: 1}}></Box>
              <Box sx={{width: 30, background: colorBlue, borderRadius: 1}}></Box>
          </Box>
      )
  }

  const FeatureWidget = ({ icon, title, description, preview }) => {
      const [ref, isInView] = useInView({ threshold: 0.1 });

      return (
          <Grid item xs={12} sm={6} md={4}>
              <Box
                  ref={ref}
                  sx={{
                      background: '#2D3748',
                      borderRadius: '16px',
                      p: '2rem',
                      height: '100%',
                      display: 'flex', flexDirection: 'column',
                      opacity: isInView ? 1 : 0,
                      transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                      transition: 'opacity 0.8s ease, transform 0.8s ease',
                  }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <i className={icon} style={{ color: colorPurple, fontSize: '1.25rem' }}></i>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#F9FAFB' }}>{title}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#A0AEC0', lineHeight: 1.6, mb: 3 }}>{description}</Typography>
                  <Box sx={{
                      backgroundColor: '#4A5568',
                      borderRadius: 2,
                      p: 2,
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                  }}>
                      {preview}
                  </Box>
              </Box>
          </Grid>
      );
  };
  // --- END: WIDGET COMPONENTS ---

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const baseButtonStyles = {
    borderRadius: '99px',
    fontWeight: 600,
    color: 'white',
    background: `linear-gradient(45deg, ${colorBlue}, ${colorPurple})`,
    backgroundSize: '150% 150%',
    backgroundPosition: '0% 50%',
    transition: 'background-position 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: `0 4px 15px -5px ${colorBlue}aa`,
    '&:hover': {
      transform: 'translateY(-3px)',
      backgroundPosition: '100% 50%',
      boxShadow: `0 6px 20px -5px ${colorPurple}`,
    }
  };
  
  const stats = [
    { value: 40, suffix: "+", label: "Forms Automated" },
    { value: 150, suffix: "+", label: "Faculty Onboarded" },
    { value: 1000, suffix: "s", label: "Of Reports Processed" }
  ];

  const faqs = [
    { question: "How do I reset my password?", answer: "If you forget your password, please contact the system administrator. For new users, you will be required to change your temporary password upon your first login." },
    { question: "Who can see the data I submit?", answer: "Your submitted data is only visible to you, your Head of Department (HOD), and the system administrators. Our role-based access control ensures data privacy." },
    { question: "What is the deadline for quarterly submissions?", answer: "Submission deadlines are set by the administration at the end of each quarter. Please refer to official circulars for the exact dates." },
    { question: "Who do I contact for technical support?", answer: "For any technical issues, such as login problems or form errors, please reach out to the IT Department or the designated portal administrator for assistance." }
  ];

  return (
    <Box sx={{ color: '#111827', overflowX: 'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: rgba(142, 45, 226, 0.2); color: #111827; }
      `}</style>
      
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        background: `linear-gradient(125deg, #F9F7FF, #E0F7FF, #FFF5E1, #FEDEFF, #F9F7FF)`,
        backgroundSize: '400% 400%',
        animation: `${auroraVibrant} 30s ease infinite`,
      }}/>
      
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <AppBar
          position="fixed" elevation={0}
          sx={{
            background: scrolled ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: scrolled ? '0 5px 20px rgba(0,0,0,0.05)' : 'none',
            top: '1rem', left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '1280px',
            borderRadius: '99px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                BIT Durg Portal
              </Typography>
              <Button href="/login" variant="contained" endIcon={<ArrowForward />} sx={baseButtonStyles}>
                Launch Portal
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        {/* --- HERO SECTION --- */}
        <Container maxWidth="xl" sx={{ pt: { xs: 20, sm: 28 }, pb: { xs: 12, sm: 16 }, textAlign: 'center' }}>
          <Box
            aria-labelledby="main-headline"
            aria-describedby="main-description"
          >
            <Typography
              id="main-headline"
              component="h1"
              sx={{
                fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
                fontWeight: 800,
                letterSpacing: '-0.04em', lineHeight: 1.1, mb: 3,
                background: `linear-gradient(135deg, ${colorBlue} 15%, ${colorPurple} 50%, #111827 85%)`,
                backgroundSize: '200% 200%', backgroundClip: 'text',
                color: 'transparent',
                animation: `${panX} 8s ease-in-out infinite`,
              }}
            >
              The Future of Academic Reporting
            </Typography>
            <Typography id="main-description" variant="h5" sx={{ my: {xs: 4, sm: 5}, mx: 'auto', maxWidth: '800px', color: '#374151', fontWeight: 400, lineHeight: 1.7, fontSize: {xs: '1.1rem', md: '1.25rem'} }}>
              A secure, centralized platform designed to streamline quarterly report submissions and provide powerful, data-driven insights.
            </Typography>
            <Button href="/login" variant="contained" size="large" endIcon={<RocketLaunch />}
              sx={{
                ...baseButtonStyles, px: 6, py: 2, fontSize: '1.2rem',
                animation: `${breathe} 4s ease-in-out infinite`,
                '&:hover': { 
                    ...baseButtonStyles['&:hover'], 
                    transform: 'translateY(-4px) scale(1.03)',
                    animation: 'none'
                }
              }}
            >
              Login to Your Dashboard
            </Button>
          </Box>
        </Container>
        
        {/* --- STATS SECTION --- */}
        <Box sx={{ py: {xs: 8, md: 12} }}>
          <Container maxWidth="lg">
            <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: {xs: 8, md: 12}, color: '#111827', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              Proven Impact & Scale
            </Typography>
            <Grid container spacing={{xs: 4, md: 5}} justifyContent="center">
              {stats.map((stat, index) => {
                const [ref, isInView] = useInView({ threshold: 0.3 });
                return (
                  <Grid item xs={12} sm={4} key={index} ref={ref} sx={{ textAlign: 'center', opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease, transform 0.8s ease', transitionDelay: `${index * 200}ms`}}>
                      <Typography component="div" sx={{ fontSize: {xs: '3.5rem', md: '5rem'}, fontWeight: 800,
                        background: `linear-gradient(135deg, ${colorPurple} 0%, ${colorOrange} 100%)`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                        <AnimatedCounter value={stat.value} />{stat.suffix}
                      </Typography>
                      <Typography sx={{ color: '#374151', fontSize: '1.1rem' }}>
                        {stat.label}
                      </Typography>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* --- WIDGET SHOWCASE SECTION --- */}
        <Box sx={{ py: {xs: 10, md: 16} }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: {xs: 8, md: 12} }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#111827', letterSpacing: '-0.02em', fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' } }}>
                A Professional-Grade Platform
              </Typography>
              <Typography variant="h6" sx={{ color: '#374151', fontWeight: 400, maxWidth: '700px', mx: 'auto', lineHeight: 1.7, fontSize: {xs: '1rem', md: '1.125rem'} }}>
                Built with a focus on security, scalability, and user experience, incorporating a range of industry-standard features.
              </Typography>
            </Box>
            <Grid container spacing={4}>
                <FeatureWidget 
                    icon="fas fa-users-cog" 
                    title="Role-Based Access" 
                    description="Secure system with distinct roles ensuring users only access relevant data."
                    preview={
                        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1}}>
                            <Box sx={{background: '#2D3748', p: '0.75rem 1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 600, color: '#F9FAFB'}}>Faculty</Typography>
                                    <Typography variant="caption" sx={{color: '#A0AEC0'}}>Submits own reports</Typography>
                                </Box>
                                <i className="fas fa-check-circle" style={{color: colorSuccess}}></i>
                            </Box>
                             <Box sx={{background: '#2D3748', p: '0.75rem 1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 600, color: '#F9FAFB'}}>HOD</Typography>
                                    <Typography variant="caption" sx={{color: '#A0AEC0'}}>Views department reports</Typography>
                                </Box>
                                <i className="fas fa-eye" style={{color: colorOrange}}></i>
                            </Box>
                             <Box sx={{background: '#2D3748', p: '0.75rem 1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 600, color: '#F9FAFB'}}>Admin</Typography>
                                    <Typography variant="caption" sx={{color: '#A0AEC0'}}>Manages all users & data</Typography>
                                </Box>
                                <i className="fas fa-user-shield" style={{color: colorDanger}}></i>
                            </Box>
                        </Box>
                    }
                />
                <FeatureWidget 
                    icon="fas fa-user-shield" 
                    title="Secure Onboarding" 
                    description="A multi-step, secure flow for new users, from creation to their first successful login."
                    preview={<OnboardingPreview />}
                />
                <FeatureWidget 
                    icon="fas fa-list-check" 
                    title="Dynamic Form System" 
                    description="A scalable system managing 40+ unique report types from a central configuration."
                    preview={<FormListPreview />}
                />
                <FeatureWidget 
                    icon="fas fa-shield-alt" 
                    title="API Security" 
                    description="Protected with JWT authentication and API rate limiting to defend against automated attacks."
                    preview={<AnalyticsPreview />}
                />
                <FeatureWidget 
                    icon="fas fa-database" 
                    title="Data Integrity" 
                    description="Backend logic prevents accidental mass data deletion, protecting valuable report history."
                    preview={<i className="fas fa-shield-alt fa-4x" style={{ color: colorSuccess }}></i>}
                />
                <FeatureWidget 
                    icon="fas fa-chart-pie" 
                    title="Analytics Dashboard" 
                    description="A dedicated dashboard for Admins and HODs to visualize submission data with interactive charts."
                    preview={<AnalyticsPreview />}
                />
            </Grid>
          </Container>
        </Box>
        
        {/* --- HOW IT WORKS SECTION --- */}
        <Box sx={{ py: {xs: 10, md: 16} }}>
          <Container maxWidth="lg">
            <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: {xs: 10, md: 14}, color: '#111827', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              How It Works
            </Typography>
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: 'space-between', gap: {xs: 12, md: 4},
                '&::before': {
                    content: '""', position: 'absolute', zIndex: 0,
                    top: {xs: '60px', md: '50%'},
                    left: {xs: '50%', md: '15%'},
                    height: {xs: 'calc(100% - 120px)', md: '4px'},
                    width: {xs: '4px', md: '70%'},
                    transform: {xs: 'translateX(-50%)', md: 'translateY(-50%)'},
                    background: `linear-gradient(to right, ${colorBlue}, ${colorPurple}, ${colorOrange})`,
                    backgroundSize: '100% 300%',
                    animation: `${flow} 5s ease infinite`,
                    opacity: 0.4, borderRadius: '2px',
                }
             }}>
              {[
                { icon: <EditNote />, title: "1. Submit Data", description: "Faculty use intuitive, dynamic forms to submit their quarterly reports and achievements.", color: colorBlue },
                { icon: <Analytics />, title: "2. Visualize The Picture", description: "HODs and Admins instantly access aggregated data and analytics on a centralized dashboard.", color: colorPurple },
                { icon: <TrendingUp />, title: "3. Drive Growth", description: "Make informed, data-driven decisions to enhance academic excellence and reporting efficiency.", color: colorOrange }
              ].map((step, index) => {
                const [ref, isInView] = useInView({ threshold: 0.4 });
                return (
                  <Box ref={ref} key={index} sx={{ textAlign: 'center', maxWidth: 320, mx: 'auto', opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: `${index * 200}ms`, zIndex: 1 }}>
                      <Box sx={{ mb: 3, p: 2, display: 'inline-flex', borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 5px 25px rgba(0,0,0,0.07)'
                      }}>
                         {React.cloneElement(step.icon, { sx: { fontSize: 48, color: step.color }})}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: '#374151', lineHeight: 1.65 }}>
                        {step.description}
                      </Typography>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>
        
        {/* --- FAQ SECTION --- */}
        <Box sx={{ py: {xs: 10, md: 16} }}>
          <Container maxWidth="md">
            <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: {xs: 8, md: 12}, color: '#111827', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              Frequently Asked Questions
            </Typography>
            {faqs.map((faq, index) => {
              const [ref, isInView] = useInView({ threshold: 0.1 });
              return (
                <Box ref={ref} key={index} sx={{opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: `${index * 150}ms` }}>
                  <Accordion sx={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                      mb: 2.5, borderRadius: 4,
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', my: '1.25rem' },
                      transition: 'all 0.3s ease'
                  }}>
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#4B5563' }} />} sx={{ py: 1.5, px: 3 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 2, px: 3 }}>
                      <Typography sx={{ color: '#374151', lineHeight: 1.65 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Container>
        </Box>
        
        {/* --- FOOTER --- */}
        <Box component="footer" sx={{ py: 6, px: 2, background: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Container maxWidth="lg" sx={{textAlign: 'center'}}>
            <Typography variant="body2" color={'#4B5563'}>
              © {new Date().getFullYear()} Bhilai Institute of Technology, Durg. All Rights Reserved.
            </Typography>
            <Typography variant="caption" color={'#6B7280'} display="block" sx={{mt: 1}}>
              A Modern Solution for Academic Excellence
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}