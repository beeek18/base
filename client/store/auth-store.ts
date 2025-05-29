import { googleAuth, login, logout, refreshTokens, register, Tokens } from '@/api/auth';
import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from '@/constants/local-storage';
import { AuthFormData } from '@/page-sections/auth/form';
import { Nullable } from '@/types/custom-utility';
import { create } from 'zustand';

export type NullableTokens = Nullable<Tokens>;

export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  status: UserStatus;
  googleId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setSession: (tokens: NullableTokens, user: User | null) => void;
  register: (form: AuthFormData) => Promise<void>;
  login: (form: AuthFormData) => Promise<void>;
  googleAuth: (accessToken: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    isAuthenticated: false,
    user: null,

    setSession: (tokens, user) => {
      if (tokens.accessToken && tokens.refreshToken) {
        localStorage.setItem(STORAGE_ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_REFRESH_TOKEN, tokens.refreshToken);
      } else {
        localStorage.removeItem(STORAGE_ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      }
      set({ isAuthenticated: !!tokens.accessToken && !!tokens.refreshToken });
      set({ user });
    },

    register: async (form) => {
      try {
        const { tokens, user } = await register(form);
        get().setSession(tokens, user);
      } catch (error) {
        console.error('Register failed:', error);
        throw error;
      }
    },

    login: async (form) => {
      try {
        const { tokens, user } = await login(form);
        get().setSession(tokens, user);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    googleAuth: async (accessToken) => {
      try {
        const { tokens, user } = await googleAuth(accessToken);
        get().setSession(tokens, user);
      } catch (error) {
        console.error('Google auth failed:', error);
        throw error;
      }
    },

    refresh: async () => {
      try {
        const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN);
        if (!refreshToken) throw new Error('Refresh token missing');
        const { tokens, user } = await refreshTokens(refreshToken);
        get().setSession(tokens, user);
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
      }
    },

    logout: async () => {
      const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN);
      try {
        if (refreshToken) {
          await logout(refreshToken);
        }
      } catch (error) {
        console.error('Logout failed, but proceeding with local state cleanup.', error);
      } finally {
        get().setSession({ accessToken: null, refreshToken: null }, null);
      }
    },
  };
});
