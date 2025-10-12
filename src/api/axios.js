import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.22:8091/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Selected-Account': 955,
  },
});

// Attach fresh token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // remove if no token
  }
  return config;
});

export default api;
