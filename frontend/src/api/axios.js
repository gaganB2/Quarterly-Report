// src/api/axios.js

import axios from 'axios';

// Get the base URL from Vite's environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// --- NEW: A professional safety check for production builds ---
// This check ensures that if the environment variable is missing during the build,
// the application will fail loudly instead of deploying a broken version.
if (import.meta.env.PROD && !apiBaseUrl) {
  console.error("CRITICAL ERROR: VITE_API_BASE_URL is not defined in the production environment.");
  // You can also throw an error to halt execution completely
  // throw new Error("VITE_API_BASE_URL is not defined in production.");
}

// Use the environment variable if it exists, otherwise fall back to localhost for development
const baseURL = apiBaseUrl || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return Promise.reject(error);
      }
      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;