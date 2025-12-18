import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5212/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Handle 200 OK but success is false (Logical Error)
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message));
    }
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized (optional: refresh token logic or logout)
    if (error.response?.status === 401) {
      // Clear storage and potentially redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // window.location.href = '/login'; // Careful with this in SPA
    }
    // Propagate the error object directly if possible, or a new Error
    // If it's a logical error from above, it comes here? No, 'response' interceptor rejection goes to catch.
    // Wait, returning Promise.reject in the success handler goes to the catch block of the caller.
    return Promise.reject(error);
  }
);

export default api;
