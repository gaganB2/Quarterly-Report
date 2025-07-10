// src/layout/MainLayout.jsx

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";


const drawerWidth = 240;
const collapsedWidth = 60;

// styled AppBar that shifts right when drawer is open
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== "open" && prop !== "drawerWidth",
})(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MainLayout({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(o => !o);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    // { text: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
    { text: "Submit Research", icon: <AddIcon />, path: "/submit-t1" },
    { text: "My Submissions", icon: <ListAltIcon />, path: "/my-submissions" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* APP BAR */}
      <StyledAppBar position="fixed" open={open} drawerWidth={open ? drawerWidth : collapsedWidth}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Quarterly Report
          </Typography>
        </Toolbar>
      </StyledAppBar>

      {/* DRAWER */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        {/* placeholder for toolbar height */}
        <Toolbar />

        <Divider />

        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItemButton
              key={text}
              onClick={() => navigate(path)}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={text} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          },
        }}
      >
        {/* push content below AppBar */}
        <Toolbar />

        {/* render either children or Outlet */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
