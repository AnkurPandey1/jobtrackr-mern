import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to catch 401s and handle logout/token expiry automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If auth error is returned (and it's not the initial current-user check)
    if (error.response && error.response.status === 401) {
      // You can dispatch a logout state change here or redirect
      if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
