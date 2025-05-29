import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ApiResponse } from '@/api/auth';
import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from '@/constants/local-storage';

export const API_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_SERVER_DEV
    : process.env.NEXT_PUBLIC_SERVER_PROD;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 100_000,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${localStorage.getItem(STORAGE_ACCESS_TOKEN)}`;
  return config;
});

api.interceptors.response.use(
  (config: AxiosResponse) => config,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN);

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry &&
      refreshToken
    ) {
      originalRequest._isRetry = true;
      try {
        const {
          data: { tokens },
        } = await axios.post<ApiResponse>(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        localStorage.setItem(STORAGE_ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_REFRESH_TOKEN, tokens.refreshToken);

        return api.request(originalRequest);
      } catch (e) {
        throw e;
      }
    }
    throw error;
  },
);
