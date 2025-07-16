import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors (like 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Unauthorized, redirecting to login...');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;