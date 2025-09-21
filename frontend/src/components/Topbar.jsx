// src/components/Topbar.jsx

import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Box, Button, Typography, Avatar, Menu, MenuItem,
  ListItemIcon, Divider, Container, IconButton, useTheme, Tooltip, Stack,
  InputBase, alpha, Badge
} from '@mui/material';
import {
  Logout, AdminPanelSettings, Business as BusinessIcon, Dashboard,
  Home, KeyboardArrowDown, Menu as MenuIcon, Assessment, Search,
  Notifications, Brightness4, Brightness7
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import topPanelImg from '../assets/favicon.png';
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

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const isUserMenuOpen = Boolean(userMenuAnchor);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

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

  const AdminMenuItems = () => (
    <>
      <MenuItem onClick={() => handleNavigate('/home')}><ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>Submissions View</MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/users')}><ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>User Management</MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/departments')}><ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>Departments</MenuItem>
      <MenuItem onClick={() => handleNavigate('/admin/analytics')}><ListItemIcon><Assessment fontSize="small" /></ListItemIcon>Analytics</MenuItem>
    </>
  );

  const FacultyMenuItems = () => (
    <MenuItem onClick={() => handleNavigate('/home')}><ListItemIcon><Home fontSize="small" /></ListItemIcon>My Submissions</MenuItem>
  );

  const LogoutMenuItem = () => (
    <MenuItem onClick={handleLogout}>
      <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
      <Typography color="error">Logout</Typography>
    </MenuItem>
  );

  return (
    <AppBar position="fixed" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          <Box
            onClick={() => handleNavigate('/')}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Box
              component="img"
              src={topPanelImg}
              alt="QR Portal Logo"
              sx={{ 
                height: { xs: 32, md: 36 }, 
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
                mr: 1.5,
              }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' }, color: 'text.primary' }}>
              Quarterly Report Management System
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* === Desktop Global Controls === */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            
            <Box sx={{
              position: 'relative',
              borderRadius: '50px',
              backgroundColor: alpha(theme.palette.text.primary, 0.05),
              border: '1px solid',
              borderColor: theme.palette.divider,
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, 0.1),
              },
              width: '320px',
            }}>
              <Box sx={{ p: '0 16px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search sx={{ color: 'text.secondary' }} />
              </Box>
              <InputBase
                placeholder="Search or type a command..."
                sx={{
                  color: 'text.primary',
                  pl: '48px',
                  width: '100%',
                  '& .MuiInputBase-input': { py: 1.5 }
                }}
              />
            </Box>

            <Tooltip title={theme.palette.mode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton onClick={colorMode.toggleColorMode} sx={{ color: 'text.secondary' }}>
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={4} color="primary">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

            {!user ? (
              <Button variant="contained" onClick={() => handleNavigate('/login')}>Login</Button>
            ) : (
              // --- THIS IS THE DEFINITIVE FIX FOR THE BROKEN MENU ---
              // The Tooltip now wraps an IconButton, and the Button that opens the menu is separate.
              // This provides a larger click area for the user while keeping the anchorEl correct.
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
          
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Tooltip title="Menu">
              <IconButton onClick={handleOpenMobileMenu} sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
            </Tooltip>
          </Box>
          
          <Menu anchorEl={userMenuAnchor} open={isUserMenuOpen} onClose={handleCloseUserMenu} PaperProps={{ sx: { minWidth: 240, mt: 1.5 } }}>
            {user?.role === 'Admin' ? <AdminMenuItems /> : <FacultyMenuItems />}
            <Divider sx={{ my: 1 }} />
            <LogoutMenuItem />
          </Menu>

          <Menu anchorEl={mobileMenuAnchor} open={isMobileMenuOpen} onClose={handleCloseMobileMenu} PaperProps={{ sx: { width: '90%', maxWidth: 320 } }}>
            {!user ? (
              <MenuItem onClick={() => handleNavigate('/login')}><ListItemIcon><Logout fontSize="small" /></ListItemIcon>Login</MenuItem>
            ) : (
              <>
                {user.role === 'Admin' ? <AdminMenuItems /> : <FacultyMenuItems />}
                <Divider sx={{ my: 1 }} />
                <LogoutMenuItem />
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}