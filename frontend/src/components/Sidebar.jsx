import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListIcon from "@mui/icons-material/List";

// Replace with your actual logo path
import LogoCompact from "../assets/logo-small.svg";

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Submit Research", icon: <AddBoxIcon />, path: "/submit-t1" },
  { text: "My Submissions", icon: <ListIcon />, path: "/my-submissions" },
];

const StyledListItem = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  transition: theme.transitions.create(["background", "padding"], {
    duration: theme.transitions.duration.short,
  }),
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Sidebar({ open }) {
  const theme = useTheme();
  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: open ? 240 : theme.spacing(7) + 1,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        "& .MuiDrawer-paper": {
          width: open ? 240 : theme.spacing(7) + 1,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          px: open ? 2 : 0,
          py: 2,
        }}
      >
        {open ? (
          <Box
            component="h6"
            sx={{
              m: 0,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 1,
              color: theme.palette.primary.main,
            }}
          >
            Quarterly
          </Box>
        ) : (
          <Box
            component="img"
            src={LogoCompact}
            alt="Logo"
            sx={{ width: 32, height: 32 }}
          />
        )}
      </Toolbar>

      <List>
        {menuItems.map(({ text, icon, path }) => {
          const selected = pathname === path;
          return (
            <Tooltip key={text} title={text} placement="right" disableHoverListener={open}>
              <StyledListItem
                component={RouterLink}
                to={path}
                selected={selected}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: open ? 2 : 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={text} />}
              </StyledListItem>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}
