import React from "react";
import MainLayout from "../layout/MainLayout";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <MainLayout>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Welcome, {username || "Faculty"} 👋
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You are logged in to the Faculty Dashboard.
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
