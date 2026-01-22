import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use relative path for proxy
const API_URL = '/api';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Send cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token (REMOVED - We use Cookie now)
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // No explicit Authorization header needed if using Cookie
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (e.g. 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // Optional: Redirect to login or show toast
        }
        return Promise.reject(error);
    }
);
