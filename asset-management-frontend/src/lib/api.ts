import axios from 'axios';

const api = axios.create({
  baseURL: 'https://assetflow-project-production.up.railway.app/api',     // ← Must be 8080
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;