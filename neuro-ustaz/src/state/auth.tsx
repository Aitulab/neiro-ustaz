/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import api from '../lib/api';
import Cookies from 'js-cookie';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  institution?: string;
  points: number;
  level: string;
  language: string;
  avatarUrl?: string;
  streakDays: number;
  createdAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    institution?: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  login: (payload: { email: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, 'fullName' | 'institution' | 'language'>>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapBackendUser(backendUser: any): UserProfile {
  return {
    id: backendUser.id?.toString() || '',
    fullName: backendUser.full_name || '',
    email: backendUser.email || '',
    institution: backendUser.university || '',
    points: backendUser.points || 0,
    level: backendUser.level_name || backendUser.level?.toString() || '1',
    language: backendUser.lang || 'ru',
    avatarUrl: backendUser.avatar_url || '',
    streakDays: backendUser.streak_days || 0,
    createdAt: backendUser.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setUser(mapBackendUser(res.data.user));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        Cookies.remove('token');
        setUser(null);
      }
    }
  }, []);

  // Initialize: check if we have a token and fetch profile
  useEffect(() => {
    const initAuth = async () => {
      await fetchProfile();
      setIsLoading(false);
    };
    initAuth();
  }, [fetchProfile]);

  const register: AuthContextValue['register'] = useCallback(async (payload) => {
    try {
      const res = await api.post('/auth/register', {
        full_name: payload.fullName,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        university: payload.institution,
      });
      if (res.data.success) {
        const { token, user } = res.data;
        Cookies.set('token', token, { expires: 30 }); // 30 days
        setUser(mapBackendUser(user));
        return { ok: true };
      }
      return { ok: false, message: res.data.error || 'registration_failed' };
    } catch (err: any) {
      return { ok: false, message: err.response?.data?.error || 'registration_failed' };
    }
  }, []);

  const login: AuthContextValue['login'] = useCallback(async (payload) => {
    try {
      const res = await api.post('/auth/login', payload);
      if (res.data.success) {
        const { token, user } = res.data;
        Cookies.set('token', token, { expires: 30 });
        setUser(mapBackendUser(user));
        return { ok: true };
      }
      return { ok: false, message: res.data.error || 'invalid_credentials' };
    } catch (err: any) {
      return { ok: false, message: err.response?.data?.error || 'invalid_credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('token');
    setUser(null);
  }, []);

  const updateProfile: AuthContextValue['updateProfile'] = useCallback(async (patch) => {
    try {
      const res = await api.put('/users/profile', patch);
      if (res.data.success) {
        setUser(mapBackendUser(res.data.user));
      }
    } catch (err) {
      console.error('Update profile failed:', err);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      token: Cookies.get('token') || null,
      register,
      login,
      logout,
      updateProfile,
      fetchProfile,
    }),
    [user, isLoading, register, login, logout, updateProfile, fetchProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
