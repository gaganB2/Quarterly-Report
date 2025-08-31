// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/axios";
import { CircularProgress, Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Start in a loading state to prevent premature rendering
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // No need to delete from apiClient defaults, the interceptor handles it.
  }, []);
  
  const updateUser = useCallback((updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // If there's no token, we know the user is not logged in.
      // Stop loading and render the app.
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      // If a token exists, try to validate it and fetch the user profile.
      try {
        const decodedToken = jwtDecode(accessToken);
        // Check if token is expired. The interceptor will handle the refresh,
        // but this check is good practice.
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Access token expired, interceptor will handle refresh.");
        }
        
        // The apiClient will automatically handle token refresh if needed.
        const response = await apiClient.get("/api/profile/");
        setUser(response.data);

      } catch (error) {
        // If profile fetch fails even after a refresh attempt, the refresh token is bad.
        // Log the user out completely.
        console.error("Auth initialization failed. Logging out.", error);
        logout();
      } finally {
        // CRITICAL: Ensure loading is set to false in all cases.
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post("/api/token/", {
        username,
        password,
      });

      const { access, refresh, user: userData } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setUser(userData);
      
      return userData;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };
  
  // While the initial auth check is running, show a full-screen loader.
  // This prevents any other part of the app from rendering with an incomplete auth state.
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