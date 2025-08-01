// src/components/Topbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Avatar,
} from '@mui/material';
import { 
  Logout, 
  AccountCircle, 
  AdminPanelSettings,
  Business as BusinessIcon 
} from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/start');
  };

  const navigateTo = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={topPanelImg}
            alt="BIT-DURG Banner"
            sx={{ height: { xs: 40, md: 50 }, objectFit: 'contain' }}
          />
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Box>
              <Button onClick={handleClick} sx={{ textTransform: 'none', color: 'text.primary' }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: stringToColor(user.username) }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <Box textAlign="left">
                    <Typography variant="body2" fontWeight="bold">{user.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                  </Box>
                )}
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
                    '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                    '&:before': {
                      content: '""', display: 'block', position: 'absolute',
                      top: 0, right: 14, width: 10, height: 10,
                      bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => navigateTo('/profile')}>
                  <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                
                {user.role === 'Admin' && (
                  <Box>
                    <Divider />
                    <MenuItem onClick={() => navigateTo('/admin/users')}>
                      <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                      User Management
                    </MenuItem>
                    <MenuItem onClick={() => navigateTo('/admin/departments')}>
                      <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                      Department Management
                    </MenuItem>
                  </Box>
                )}

                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}