// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/axios";
import { CircularProgress, Box } from "@mui/material";
// --- V FIXED: Use a named import instead of a default import ---
import { jwtDecode } from "jwt-decode";
// --- ^ END FIXED ---

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

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          // --- V FIXED: Use the correctly imported function name ---
          const decodedToken = jwtDecode(accessToken);
          // --- ^ END FIXED ---
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

  const value = {
    user,
    loading,
    login,
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
