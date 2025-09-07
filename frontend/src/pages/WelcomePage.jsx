// src/pages/WelcomePage.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  keyframes,
  GlobalStyles,
  Stack,
} from "@mui/material";
import {
  ArrowForward,
  RocketLaunch,
  EditNote,
  Analytics,
  TrendingUp,
  ExpandMore,
  School,
  Apartment,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// --- KEYFRAMES (Unchanged) ---
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

// --- HOOKS & UTILITIES (Unchanged) ---
const useInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options, ref]);
  return [ref, isInView];
};

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView({ threshold: 0.5, triggerOnce: true });
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
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// --- Main Landing Page Component ---
export default function WelcomePage() {
  const colorPurple = "#8B5CF6";
  const colorBlue = "#4A00E0";
  const colorOrange = "#FF9100";

  // --- FIX: A lighter, theme-appropriate widget background color ---
  const widgetBgColor = "rgba(255, 255, 255, 0.5)";
  const widgetTextColor = "#374151";
  const widgetSubTextColor = "#6B7280";
  const widgetHeaderColor = "#111827";
  const widgetPreviewBgColor = "rgba(0, 0, 0, 0.04)";

  // --- Reusable Feature Widget Component ---
  const FeatureWidget = ({ icon, title, description, preview }) => {
    const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Box
          ref={ref}
          sx={{
            background: widgetBgColor,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            p: "2rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            {icon}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: widgetHeaderColor }}
            >
              {title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: widgetSubTextColor,
              lineHeight: 1.6,
              mb: 3,
              flexGrow: 1,
            }}
          >
            {description}
          </Typography>
          <Box
            sx={{
              backgroundColor: widgetPreviewBgColor,
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
            }}
          >
            {preview}
          </Box>
        </Box>
      </Grid>
    );
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseButtonStyles = {
    borderRadius: "99px",
    fontWeight: 600,
    color: "white",
    background: `linear-gradient(45deg, ${colorBlue}, ${colorPurple})`,
    backgroundSize: "150% 150%",
    backgroundPosition: "0% 50%",
    transition:
      "background-position 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: `0 4px 15px -5px ${colorBlue}aa`,
    "&:hover": {
      transform: "translateY(-3px)",
      backgroundPosition: "100% 50%",
      boxShadow: `0 6px 20px -5px ${colorPurple}`,
    },
  };

  const stats = [
    { value: 40, suffix: "+", label: "Forms Automated" },
    { value: 150, suffix: "+", label: "Faculty Onboarded" },
    { value: 1000, suffix: "s", label: "Of Reports Processed" },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "A 'Forgot Password' link is available on the login pages. For new staff, you will be required to change your temporary password upon your first login.",
    },
    {
      question: "Who can see the data I submit?",
      answer:
        "Your submitted data is only visible to you, your Head of Department (HOD), and the system administrators. Our role-based access control ensures data privacy.",
    },
    {
      question: "What is the deadline for quarterly submissions?",
      answer:
        "Submission deadlines are set by the administration at the end of each quarter. Please refer to official circulars for the exact dates.",
    },
    {
      question: "Who do I contact for technical support?",
      answer:
        "For any technical issues, such as login problems or form errors, please reach out to the IT Department or the designated portal administrator for assistance.",
    },
  ];

  const globalStyles = {
    html: { scrollBehavior: "smooth" },
    body: {
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  };

  return (
    <Box sx={{ color: "#111827", overflowX: "hidden" }}>
      <GlobalStyles styles={globalStyles} />

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background: `linear-gradient(125deg, #F9F7FF, #E0F7FF, #FFF5E1, #FEDEFF, #F9F7FF)`,
          backgroundSize: "400% 400%",
          animation: `${auroraVibrant} 30s ease infinite`,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 2 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: scrolled
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: scrolled ? "0 5px 20px rgba(0,0,0,0.05)" : "none",
            top: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 2rem)",
            maxWidth: "1280px",
            borderRadius: "99px",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#111827" }}
              >
                BIT Durg Portal
              </Typography>
              {/* --- FIX: DUAL LOGIN BUTTONS IN TOP BAR --- */}
              <Stack direction="row" spacing={1}>
                <Button
                  href="/login/student"
                  variant="outlined"
                  sx={{ borderRadius: "50px", fontWeight: 600 }}
                >
                  Student
                </Button>
                <Button
                  href="/login"
                  variant="contained"
                  sx={{ ...baseButtonStyles, px: 3 }}
                >
                  Faculty & Staff
                </Button>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            pt: { xs: 20, sm: 28 },
            pb: { xs: 12, sm: 16 },
            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                mb: 3,
                background: `linear-gradient(135deg, ${colorBlue} 15%, ${colorPurple} 50%, #111827 85%)`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                color: "transparent",
                animation: `${panX} 8s ease-in-out infinite`,
              }}
            >
              The Future of Academic Reporting
            </Typography>
            <Typography
              variant="h5"
              sx={{
                my: { xs: 4, sm: 5 },
                mx: "auto",
                maxWidth: "800px",
                color: "#374151",
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              A secure, centralized platform designed for both faculty and
              students to streamline quarterly submissions and provide powerful,
              data-driven insights.
            </Typography>
            {/* --- FIX: DUAL LOGIN BUTTONS IN HERO SECTION --- */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                href="/login/student"
                variant="contained"
                size="large"
                endIcon={<School />}
                sx={{ ...baseButtonStyles, px: 6, py: 2, fontSize: "1.2rem" }}
              >
                Student Login
              </Button>
              <Button
                href="/login"
                variant="contained"
                size="large"
                endIcon={<Apartment />}
                sx={{ ...baseButtonStyles, px: 6, py: 2, fontSize: "1.2rem" }}
              >
                Faculty & Staff Login
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* --- STATS SECTION --- */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: { xs: 8, md: 12 },
                color: "#111827",
                letterSpacing: "-0.02em",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Proven Impact & Scale
            </Typography>
            <Grid container spacing={{ xs: 4, md: 5 }} justifyContent="center">
              {stats.map((stat, index) => {
                const [ref, isInView] = useInView({ threshold: 0.3 });
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    key={index}
                    ref={ref}
                    sx={{
                      textAlign: "center",
                      opacity: isInView ? 1 : 0,
                      transform: isInView
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transition: "opacity 0.8s ease, transform 0.8s ease",
                      transitionDelay: `${index * 200}ms`,
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontSize: { xs: "3.5rem", md: "5rem" },
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${colorPurple} 0%, ${colorOrange} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                      }}
                    >
                      <AnimatedCounter value={stat.value} />
                      {stat.suffix}
                    </Typography>
                    <Typography sx={{ color: "#374151", fontSize: "1.1rem" }}>
                      {stat.label}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* --- FIX: UPDATED FACULTY FEATURE SHOWCASE SECTION --- */}
        <Box
          sx={{ py: { xs: 10, md: 16 }, background: "rgba(255,255,255,0.2)" }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
                }}
              >
                A Professional Platform for Faculty & Staff
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: widgetTextColor,
                  fontWeight: 400,
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.7,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                Built with a focus on security, scalability, and an efficient
                user experience.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <FeatureWidget
                icon={<Apartment color="primary" />}
                title="Role-Based Access"
                description="Secure system with distinct roles (Faculty, HOD, Admin) ensuring users only access relevant data."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    Faculty, HOD, Admin Views
                  </Typography>
                }
              />
              <FeatureWidget
                icon={<Analytics color="primary" />}
                title="Analytics Dashboard"
                description="A dedicated dashboard for Admins and HODs to visualize submission data with interactive charts."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    Charts & Filters
                  </Typography>
                }
              />
              <FeatureWidget
                icon={<EditNote color="primary" />}
                title="Bulk Data Management"
                description="A guided, template-driven Excel import/export system to handle large datasets efficiently."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    Import/Export .xlsx
                  </Typography>
                }
              />
            </Grid>
          </Container>
        </Box>

        {/* --- NEW: STUDENT FEATURE SHOWCASE SECTION --- */}
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
                }}
              >
                Empowering Students to Showcase Achievements
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: widgetTextColor,
                  fontWeight: 400,
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.7,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                A dedicated portal for students to submit publications, track
                achievements, and log career milestones.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <FeatureWidget
                icon={<School color="primary" />}
                title="Student Publications"
                description="Submit and track research articles and conference papers (S2.1 & S2.2)."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    S-Series Research Forms
                  </Typography>
                }
              />
              <FeatureWidget
                icon={<TrendingUp color="primary" />}
                title="Career Outcomes"
                description="Log placements, higher studies, and competitive exam qualifications (S4 Series)."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    Placement & Higher Studies
                  </Typography>
                }
              />
              <FeatureWidget
                icon={<RocketLaunch color="primary" />}
                title="Achievements & Activities"
                description="Record participation in competitions, workshops, and entrepreneurship ventures (S3 & S5 Series)."
                preview={
                  <Typography sx={{ color: widgetTextColor }}>
                    Competitions & Awards
                  </Typography>
                }
              />
            </Grid>
          </Container>
        </Box>

        <Box
          sx={{ py: { xs: 10, md: 16 }, background: "rgba(255,255,255,0.2)" }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: { xs: 8, md: 12 },
                color: "#111827",
                letterSpacing: "-0.02em",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Frequently Asked Questions
            </Typography>
            {faqs.map((faq, index) => {
              const [ref, isInView] = useInView({
                threshold: 0.1,
                triggerOnce: true,
              });
              return (
                <Box
                  ref={ref}
                  key={index}
                  sx={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.7s ease, transform 0.7s ease",
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <Accordion
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)",
                      mb: 2.5,
                      borderRadius: 4,
                      "&:before": { display: "none" },
                      "&.Mui-expanded": {
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                        my: "1.25rem",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: "#4B5563" }} />}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: "#374151", lineHeight: 1.65 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 6,
            px: 2,
            background: "rgba(255,255,255,0.5)",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: "center" }}>
            <Typography variant="body2" color={"#4B5563"}>
              © {new Date().getFullYear()} Bhilai Institute of Technology, Durg.
              All Rights Reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
