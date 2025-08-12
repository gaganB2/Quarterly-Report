// src/components/Topbar.jsx

import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Toolbar, Box, Button, Typography, Avatar, Menu, MenuItem,
  ListItemIcon, Divider, Container, IconButton, useTheme, Tooltip, Stack,
} from '@mui/material';
import {
  Logout, AdminPanelSettings, Business as BusinessIcon, Dashboard,
  Settings, KeyboardArrowDown, Menu as MenuIcon, Home
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import topPanelImg from '../assets/bittoppanel.png';
import ColorModeContext from '../ThemeContext';

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

/**
 * A professional-grade, responsive Topbar with full light/dark mode support.
 */
export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [isScrolled, setScrolled] = useState(false);

  const isUserMenuOpen = Boolean(userMenuAnchor);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const isWelcomePage = location.pathname === '/';
  
  // Determine if the AppBar should be transparent
  const isTransparent = isWelcomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Handlers ---
  const handleOpenUserMenu = (event) => setUserMenuAnchor(event.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchor(null);
  const handleOpenMobileMenu = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleCloseMobileMenu = () => setMobileMenuAnchor(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseUserMenu();
    handleCloseMobileMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    handleCloseMobileMenu();
    navigate('/');
  };

  // --- Menu Item Components (for reusability) ---
  const AdminMenuItems = () => (
    <>
      <MenuItem onClick={() => handleNavigate('/home')}>
        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
        Submissions View
      </MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/users')}>
        <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
        User Management
      </MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/departments')}>
        <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
        Departments
      </MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/analytics')}>
        <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
        Analytics
      </MenuItem>
    </>
  );

  const FacultyMenuItems = () => (
    <MenuItem onClick={() => handleNavigate('/home')}>
      <ListItemIcon><Home fontSize="small" /></ListItemIcon>
      My Submissions
    </MenuItem>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: isTransparent ? 'transparent' : theme.palette.background.paper,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: isTransparent ? 'transparent' : theme.palette.divider,
        transition: theme.transitions.create(['background', 'border-color'], {
          duration: theme.transitions.duration.short,
        }),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box
            component="img"
            src={topPanelImg}
            alt="BIT-DURG Banner"
            onClick={() => handleNavigate('/')}
            sx={{ 
              height: { xs: 36, md: 42 }, 
              cursor: 'pointer',
              // Adjust filter for dark mode on welcome page
              filter: isTransparent && theme.palette.mode === 'light' ? 'brightness(1.5) contrast(1.2)' : 'none',
            }}
          />
          <Box sx={{ flexGrow: 1 }} />

          {/* === Desktop Navigation === */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {!user ? (
              <Button variant="contained" onClick={() => handleNavigate('/login')}>
                Login
              </Button>
            ) : (
              <Tooltip title="Account settings">
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{ borderRadius: '50px', p: 0.5, textTransform: 'none' }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: stringToColor(user.username) }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Stack sx={{ textAlign: 'left', color: 'text.primary' }}>
                       <Typography variant="body2" fontWeight="600">{user.full_name}</Typography>
                       <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                    </Stack>
                    <KeyboardArrowDown sx={{ color: 'text.secondary', transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </Stack>
                </Button>
              </Tooltip>
            )}
          </Stack>
          
          {/* === Mobile Navigation === */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Tooltip title="Menu">
              <IconButton
                onClick={handleOpenMobileMenu}
                aria-label="open navigation menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* --- Menus --- */}
          {/* User Menu (Desktop) */}
          <Menu
            anchorEl={userMenuAnchor}
            open={isUserMenuOpen}
            onClose={handleCloseUserMenu}
            MenuListProps={{ 'aria-labelledby': 'user-menu-button' }}
            PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 240, mt: 1.5 } }}
          >
            {user?.role === 'Admin' ? <AdminMenuItems /> : <FacultyMenuItems />}
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Mobile Menu */}
          <Menu
            id="mobile-menu"
            anchorEl={mobileMenuAnchor}
            open={isMobileMenuOpen}
            onClose={handleCloseMobileMenu}
            PaperProps={{ elevation: 3, sx: { borderRadius: 2, width: '90%', maxWidth: 320 } }}
          >
            {!user ? (
              <MenuItem onClick={() => handleNavigate('/login')}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Login
              </MenuItem>
            ) : (
              <>
                {user.role === 'Admin' ? <AdminMenuItems /> : <FacultyMenuItems />}
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}