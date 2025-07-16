// src/components/Topbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import Tilt from 'react-parallax-tilt';
import topPanelImg from '../assets/bittoppanel.png';

// shimmer animation for the subtle moving highlight
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// fade‐in for each logo
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function Topbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logos = [
    '/assets/logos/nba.png',
    '/assets/logos/naac.png',
    '/assets/logos/iso9001.png',
    '/assets/logos/iso14001.png',
    '/assets/logos/igcbc.png',
  ];

  return (
    <Tilt
      tiltEnable
      tiltMaxAngleX={5}
      tiltMaxAngleY={2}
      perspective={700}
      glareEnable
      glareMaxOpacity={0.04}
      style={{ width: '100%' }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          py: { xs: 1, md: 2 },
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255,255,255,0.25)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'visible',
          zIndex: theme.zIndex.drawer + 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            backdropFilter: 'blur(24px)',
            backgroundColor: 'rgba(255,255,255,0.35)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            backgroundSize: '200% 100%',
            animation: `${shimmer} 10s linear infinite`,
          },
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left: fixed accreditation banner */}
            <Box
              component="img"
              src={topPanelImg}
              alt="BIT-DURG Accreditation Banner"
              sx={{
                height: 'auto',
                maxHeight: { xs: 60, md: 80 },
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />

            {/* Right: logos */}
            <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
              {logos.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt=""
                  sx={{
                    height: isMobile ? 32 : 48,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.15)' },
                    cursor: 'pointer',
                    opacity: 0,
                    animation: `${fadeIn} 0.6s forwards`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Tilt>
  );
}
