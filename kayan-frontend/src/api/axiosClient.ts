import axios, { type InternalAxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;