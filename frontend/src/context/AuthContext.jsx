// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { CircularProgress, Box } from "@mui/material";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("/api/profile/");
      setUser(response.data);
      localStorage.setItem('role', response.data.role);
      return response.data; // <-- ADD THIS LINE to return the user profile
    } catch (error) {
      console.error("Could not fetch user profile", error);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      throw error; // <-- ADD THIS LINE to let the caller know it failed
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const value = {
    user,
    loading, // <-- Expose the loading state
    login: fetchUserProfile,
    logout,
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
