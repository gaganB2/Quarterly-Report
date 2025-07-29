// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios"; // Import the axios client
import { CircularProgress, Box } from "@mui/material";

// Create context
export const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  // 1. User state starts as null, not with dummy data.
  const [user, setUser] = useState(null);
  // Add a loading state to show a spinner while we check for an existing token.
  const [loading, setLoading] = useState(true);

  // 2. This function will fetch the user's profile from the API.
  const fetchUserProfile = async () => {
    try {
      // The apiClient automatically includes the token from localStorage
      const response = await apiClient.get("/api/profile/");
      setUser(response.data); // Set user with real data from the backend
      // Also store the role in localStorage for easy access
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      console.error("Could not fetch user profile", error);
      // If fetching fails (e.g., bad token), clear user and token
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  };

  // 3. This `useEffect` runs once when the app starts.
  // It checks if a token already exists in localStorage (from a previous session).
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false); // If no token, we're done loading.
    }
  }, []);

  // 4. A logout function to clear session
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Optionally redirect to login page here if needed, often handled in components
  };

  // 5. Value provided to children now includes the user, the fetch function, and logout
  const value = {
    user,
    login: fetchUserProfile, // We expose the fetch function as 'login'
    logout,
  };
  
  // While checking for the token, show a loading spinner to prevent flicker
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