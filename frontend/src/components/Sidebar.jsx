import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Submit Research', icon: <AddIcon />, path: '/submit-t1' },
  { text: 'My Submissions', icon: <ListIcon />, path: '/my-submissions' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const drawerContent = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #5e35b1, #1a237e)', color: '#fff' }}>
      <Toolbar>
        <RouterLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box component="h5" sx={{ m: 0, fontWeight: 'bold' }}>
            Quarterly Report
          </Box>
        </RouterLink>
      </Toolbar>
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <motion.div
            key={text}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ListItemButton
              component={RouterLink}
              to={path}
              selected={location.pathname === path}
              sx={{
                color: '#fff',
                mb: 1,
                borderRadius: 2,
                ...(location.pathname === path && { backgroundColor: 'rgba(255,255,255,0.1)' }),
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navigation drawer">
      <Drawer
        variant={isSmUp ? 'persistent' : 'temporary'}
        open={isSmUp ? true : mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        anchor="left"
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
