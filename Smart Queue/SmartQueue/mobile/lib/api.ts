import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';
import { getToken, setToken, setUser } from '@/lib/tokenStore';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored session so AuthProvider restores to signed_out
      await setToken(null);
      await setUser(null);
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Check your network and backend URL.';
    } else if (!error.response) {
      error.message = `Cannot reach server at ${API_BASE_URL}. Is the backend running?`;
    }
    return Promise.reject(error);
  }
);
