// src/api/axios.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: { "Content-Type": "application/json" },
});

// --- V NEW: JWT Request Interceptor ---
// This function runs before every single request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Get the access token from local storage.
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // If the token exists, add the 'Bearer' token to the Authorization header.
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // If there's an error during the request setup, reject the promise.
    return Promise.reject(error);
  }
);
// --- ^ END NEW ---


// --- V NEW: JWT Response Interceptor for Token Refresh ---
// This function runs after a response is received.
apiClient.interceptors.response.use(
  // If the response is successful (e.g., 200 OK), just return it.
  (response) => {
    return response;
  },
  // If the response is an error...
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and if we haven't already tried to refresh.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as having been retried.

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // Make a request to our new /api/token/refresh/ endpoint.
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Store the new access token.
        localStorage.setItem("accessToken", access);
        
        // Update the authorization header on our original failed request.
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request with the new token.
        return apiClient(originalRequest);

      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out.
        // (This will be handled by the AuthContext in a later step).
        console.error("Token refresh failed:", refreshError);
        // It's important to reject the promise to stop the request chain.
        return Promise.reject(refreshError);
      }
    }
    // For any other errors, just pass them along.
    return Promise.reject(error);
  }
);
// --- ^ END NEW ---

export default apiClient;
