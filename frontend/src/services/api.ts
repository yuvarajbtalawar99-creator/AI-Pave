import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Accept': 'application/json',
  },
});

// Automatically inject JWT Bearer token into Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aipave_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized responses to clear stale sessions
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't clear token on login or me check failure if it's already empty
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
      if (!isAuthRoute) {
        localStorage.removeItem('aipave_auth_token');
        localStorage.removeItem('aipave_user');
      }
    }
    return Promise.reject(error);
  }
);
