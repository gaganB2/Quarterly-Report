// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import { 
  Logout, 
  AdminPanelSettings, 
  Business as BusinessIcon,
  Dashboard,
  Settings,
  KeyboardArrowDown
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
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
        backgroundColor: isScrolled || !isWelcomePage 
          ? 'rgba(255, 255, 255, 0.98)' 
          : 'transparent',
        backdropFilter: isScrolled || !isWelcomePage 
          ? 'blur(24px) saturate(180%)'
          : 'blur(8px)',
        borderBottom: isScrolled || !isWelcomePage 
          ? '1px solid rgba(0, 0, 0, 0.06)' 
          : 'none',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
          : 'none',
        zIndex: 1300,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters
          sx={{
            minHeight: { xs: 68, md: 76 },
            px: { xs: 2, md: 0 }
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={topPanelImg}
            alt="BIT-DURG Banner"
            onClick={() => navigate('/')}
            sx={{ 
              height: { xs: 38, md: 48 }, 
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: isScrolled || !isWelcomePage 
                ? 'none' 
                : 'brightness(1.1) contrast(1.1)',
              '&:hover': {
                transform: 'scale(1.02)',
                filter: 'brightness(1.1)'
              }
            }}
          />
          
          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Welcome page - Login button */}
          {isWelcomePage && !user && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              endIcon={!isMobile ? <KeyboardArrowDown sx={{ ml: -0.5, transform: 'rotate(-90deg)' }} /> : null}
              sx={{
                borderRadius: '60px',
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.4 },
                textTransform: 'none',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: isScrolled 
                  ? '0 8px 32px rgba(102, 126, 234, 0.4)' 
                  : '0 12px 40px rgba(102, 126, 234, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                  boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px) scale(1.02)',
                  '&::before': {
                    left: '100%',
                  }
                }
              }}
            >
              {isMobile ? 'Login' : 'Login / Get Started'}
            </Button>
          )}

          {/* User menu */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Quick actions for non-welcome pages */}
              {!isWelcomePage && (
                <IconButton
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    p: 1.2,
                    borderRadius: '16px',
                    backgroundColor: isScrolled 
                      ? 'rgba(99, 102, 241, 0.08)' 
                      : 'rgba(255, 255, 255, 0.12)',
                    color: isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
                    }
                  }}
                >
                  <Dashboard fontSize="small" />
                </IconButton>
              )}

              {/* Role indicator chip */}
              {user.role === 'Admin' && !isMobile && (
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: isScrolled 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(255, 255, 255, 0.2)',
                    color: isScrolled ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                />
              )}
              
              {/* User profile button */}
              <Button
                onClick={handleClick}
                variant="text"
                sx={{
                  borderRadius: '50px',
                  p: 0.8,
                  minWidth: 'auto',
                  backgroundColor: isScrolled || !isWelcomePage
                    ? 'rgba(99, 102, 241, 0.08)'
                    : 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.12)',
                    transform: 'translateY(-1px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar 
                    sx={{ 
                      width: { xs: 36, md: 40 }, 
                      height: { xs: 36, md: 40 }, 
                      bgcolor: stringToColor(user.username),
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 700,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {!isTablet && (
                    <Box sx={{ textAlign: 'left', pr: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="700" 
                        sx={{ 
                          color: isScrolled || !isWelcomePage ? "text.primary" : "white",
                          lineHeight: 1.2,
                          fontSize: '0.9rem'
                        }}
                      >
                        {user.username}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isScrolled || !isWelcomePage 
                            ? "text.secondary" 
                            : "rgba(255, 255, 255, 0.8)",
                          textTransform: 'capitalize',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {user.role}
                      </Typography>
                    </Box>
                  )}
                  
                  <KeyboardArrowDown 
                    sx={{ 
                      color: isScrolled || !isWelcomePage ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
                      transition: 'transform 0.2s',
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </Box>
              </Button>
            </Box>
          )}

          {/* Enhanced dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                mt: 2,
                borderRadius: 4,
                minWidth: 220,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 20px 64px rgba(0, 0, 0, 0.15)',
                '& .MuiMenuItem-root': {
                  borderRadius: 3,
                  mx: 1.5,
                  my: 0.5,
                  py: 1.2,
                  px: 2,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    transform: 'translateX(4px)',
                  }
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: 12,
                  height: 12,
                  bgcolor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderBottom: 'none',
                  borderRight: 'none',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Enhanced user info header */}
            <Box sx={{ 
              px: 3, 
              py: 2, 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              borderRadius: 3,
              mx: 1.5,
              mb: 1,
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
              <Typography variant="body1" fontWeight="700" color="text.primary">
                {user?.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: user?.role === 'Admin' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(34, 197, 94, 0.1)',
                    color: user?.role === 'Admin' ? '#ef4444' : '#22c55e',
                    textTransform: 'capitalize'
                  }}
                />
              </Box>
            </Box>

            {/* Admin menu items */}
            {user?.role === 'Admin' && (
              <>
                <MenuItem onClick={() => navigateTo('/admin/users')}>
                  <ListItemIcon sx={{ color: '#ef4444' }}>
                    <AdminPanelSettings fontSize="small" />
                  </ListItemIcon>
                  User Management
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/admin/departments')}>
                  <ListItemIcon sx={{ color: '#3b82f6' }}>
                    <BusinessIcon fontSize="small" />
                  </ListItemIcon>
                  Departments
                </MenuItem>
                <Divider sx={{ my: 1, mx: 1.5 }} />
              </>
            )}

            {/* Common menu items */}
            <MenuItem onClick={() => navigateTo('/settings')}>
              <ListItemIcon sx={{ color: '#6b7280' }}>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            
            <MenuItem 
              onClick={handleLogout}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#dc2626'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}