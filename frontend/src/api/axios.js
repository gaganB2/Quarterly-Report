// src/api/axios.js

import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// This check now runs during the build process on the server. If the variable
// is missing for any reason, the entire build will fail, which is safer.
if (import.meta.env.PROD && !apiBaseUrl) {
  throw new Error("CRITICAL BUILD ERROR: VITE_API_BASE_URL is not defined in the production environment. Build failed.");
}

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
        // In a real app, you would redirect to login here.
        // For example, by calling a global logout function.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;