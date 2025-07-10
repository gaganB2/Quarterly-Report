// src/components/Topbar.jsx
// Netflix-inspired AppBar with drawer toggle and theme switch

import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ColorModeContext from '../ThemeContext';

export default function Topbar({ onDrawerToggle, drawerWidth }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar>
        {!isSmUp && (
          <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
          Quarterly Report
        </Typography>
        <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
