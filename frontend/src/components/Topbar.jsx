// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Logout, AdminPanelSettings, Business as BusinessIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import topPanelImg from '../assets/bittoppanel.png';

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setScrolled] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const navigateTo = (path) => {
    handleClose();
    navigate(path);
  };
  
  const isWelcomePage = window.location.pathname === '/';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent',
        transition: 'background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
      }}
    >
      <Toolbar sx={{
        maxWidth: 'xl',
        width: '100%',
        margin: '0 auto',
        px: { xs: 2, md: 3 }
      }}>
        <Box
          component="img"
          src={topPanelImg}
          alt="BIT-DURG Banner"
          sx={{ height: 40, objectFit: 'contain' }}
        />
        <Box sx={{ flexGrow: 1 }} />
        
        {isWelcomePage && !user && (
          <Button variant="contained" onClick={() => navigate('/login')}>
            Login / Get Started
          </Button>
        )}

        {user && (
          <Box>
            <Button onClick={handleClick} sx={{ textTransform: 'none', p: 0.5, borderRadius: 99 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: stringToColor(user.username) }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box textAlign="left" sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" fontWeight="bold" color={isScrolled || !isWelcomePage ? "text.primary" : "white"}>{user.username}</Typography>
                <Typography variant="caption" color={isScrolled || !isWelcomePage ? "text.secondary" : "rgba(255, 255, 255, 0.7)"}>{user.role}</Typography>
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  overflow: 'visible',
                  mt: 1.5,
                  borderRadius: 2,
                  '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                  '&::before': {
                    content: '""', display: 'block', position: 'absolute',
                    top: 0, right: 14, width: 10, height: 10,
                    bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {user.role === 'Admin' && (
                <Box>
                  <MenuItem onClick={() => navigateTo('/admin/users')}>
                    <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                    User Management
                  </MenuItem>
                  <MenuItem onClick={() => navigateTo('/admin/departments')}>
                    <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                    Departments
                  </MenuItem>
                  <Divider />
                </Box>
              )}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}