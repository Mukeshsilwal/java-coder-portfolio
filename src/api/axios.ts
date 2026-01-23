import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use relative path for proxy in dev (vite.config.ts) and rewrites in prod (vercel.json)
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

// Queue for requests failing while refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handle Errors (e.g. 401/403)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If error is 403 (Forbidden) likely refers to expired token (if using JWT filter logic that continues chain)
        // Spring Security returns 403 for denial.
        if (error.response?.status === 403 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh
                await axiosInstance.post('/auth/refresh');
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
