// src/components/Topbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Typography, // Import Typography
  Button,     // Import Button
} from '@mui/material';
import { keyframes } from '@emotion/react';
import topPanelImg from '../assets/bittoppanel.png';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { useNavigate } from 'react-router-dom';   // 2. Import useNavigate for redirection

// ... (keyframes remain the same)
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;


export default function Topbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjusted for better wrapping

  // 3. Get user and logout function from AuthContext
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user session from context and localStorage
    navigate('/start'); // Redirect to the login page
  };

  const logos = [
    // ... (logos array remains the same)
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        // ... (AppBar styling remains the same)
      }}
    >
      <Container maxWidth="xl"> {/* Changed to xl for more space */}
        <Toolbar
          disableGutters
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2, // ensure above shimmer
          }}
        >
          {/* Left: BIT banner */}
          <Box
            component="img"
            src={topPanelImg}
            alt="BIT-DURG Accreditation Banner"
            sx={{
              height: 'auto',
              maxHeight: { xs: 50, md: 70 }, // Slightly adjusted
              objectFit: 'contain',
              userSelect: 'none',
              display: isMobile ? 'none' : 'block', // Hide banner on very small screens
            }}
          />

          {/* 4. USER INFO AND LOGOUT BUTTON */}
          {user && (
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' }, ml: {md: 2} }}>
              <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                Welcome, {user.username}
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                ({user.department} - {user.role})
              </Typography>
            </Box>
          )}

          {/* Right: action buttons or logos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2, ml: 'auto' }}>
            {user ? (
              <Button color="inherit" variant="outlined" size="small" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              // This part shows logos only when the user is NOT logged in (i.e., on the login page)
              logos.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt=""
                  sx={{
                    height: isMobile ? 32 : 40,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.15)' },
                    cursor: 'pointer',
                    opacity: 0,
                    animation: `${fadeIn} 0.6s forwards`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}