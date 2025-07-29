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
  IconButton, // <-- Import IconButton
  Avatar,     // <-- Import Avatar
  Menu,       // <-- Import Menu
  MenuItem,   // <-- Import MenuItem
  ListItemIcon, // <-- Import ListItemIcon
  Divider,    // <-- Import Divider
} from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material'; // <-- Import Icons
import { keyframes } from '@emotion/react';
import topPanelImg from '../assets/bittoppanel.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Helper function to create a color from a string for the Avatar ---
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- State for the user menu dropdown ---
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/start');
  };

  return (
    <AppBar
      position="fixed"
      elevation={1} // Use a subtle shadow
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          {/* Left: BIT banner */}
          <Box
            component="img"
            src={topPanelImg}
            alt="BIT-DURG Banner"
            sx={{
              height: 'auto',
              maxHeight: { xs: 40, md: 50 },
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />

          {/* Spacer to push user menu to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right: User Menu */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleClick}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  borderRadius: '20px',
                  p: '4px 8px',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: stringToColor(user.username),
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <Box textAlign="left">
                    <Typography variant="body2" fontWeight="bold" lineHeight={1.2}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                      {user.role}
                    </Typography>
                  </Box>
                )}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
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
