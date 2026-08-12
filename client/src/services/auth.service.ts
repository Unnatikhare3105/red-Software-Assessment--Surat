import { api } from './api.service';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/src/types/auth.types';

export const authService = {
  register: (payload: RegisterPayload) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload),

  logout: () => api.post('/auth/logout'),
};