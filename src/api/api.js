import axios from 'axios';

// Hosting-ready: reads from .env (VITE_ prefix required by Vite)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
            config.headers['Authorization'] = `Bearer ${token}`; // Support standard Bearer
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
