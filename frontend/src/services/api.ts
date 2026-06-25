import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios Instance Configuration
// Centralises base URL and default headers for all API calls.
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',          // Proxied to http://localhost:5000/api by Vite
  timeout: 10000,            // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor — attach JWT token if present ─────────────────────────
// This runs before every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor — handle auth errors globally ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 Unauthorized, clear the stored token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
