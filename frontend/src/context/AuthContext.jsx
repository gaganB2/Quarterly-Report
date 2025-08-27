// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/axios";
import { CircularProgress, Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete apiClient.defaults.headers.common["Authorization"];
  }, []);

  
  // Allows other parts of the app to update the user state after an action, like changing a password.
  const updateUser = useCallback((updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Access token expired, interceptor will refresh.");
          }
          
          const response = await apiClient.get("/api/profile/");
          setUser(response.data);

        } catch (error) {
          console.error("Failed to initialize auth, logging out.", error);
          logout();
        }
      }
      setLoading(false);
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
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      
      return userData;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // --- EXPOSE THE NEW FUNCTION IN THE CONTEXT VALUE ---
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser, // Add the new function here
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