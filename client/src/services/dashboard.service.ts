import { api } from './api.service';
import { DashboardStats } from '@/src/types/dashboard.types';

export const dashboardService = {
  getStats: () => api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats'),
};