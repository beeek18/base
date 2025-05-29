import { api } from '@/lib/api';
import { AuthFormData } from '@/page-sections/auth/form';
import { User } from '@/store/auth-store';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse {
  tokens: Tokens;
  user: User;
}

export const register = async (form: AuthFormData) => {
  const { data } = await api.post<ApiResponse>('/auth/register', form);
  return data;
};

export const login = async (form: AuthFormData) => {
  const { data } = await api.post<ApiResponse>('/auth/login', form);
  return data;
};

export const googleAuth = async (accessToken: string) => {
  const { data } = await api.post<ApiResponse>('/auth/google', {
    accessToken,
  });

  return data;
};

export const refreshTokens = async (refreshToken: string) => {
  const { data } = await api.post<ApiResponse>('/auth/refresh', {
    refreshToken,
  });
  return data;
};

export const logout = async (refreshToken: string) => {
  await api.post<void>('/auth/logout', {
    refreshToken,
  });
};
