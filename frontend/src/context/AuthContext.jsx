// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  // Dummy user (replace with real auth or API response later)
  const [user] = useState({
    name: "Gagan Sahu",
    role: "Faculty",
    email: "gagan@example.com",
  });

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
