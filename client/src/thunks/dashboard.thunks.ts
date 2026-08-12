import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '@/src/services/dashboard.service';
import { extractError } from '@/src/utils/extractError';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await dashboardService.getStats();
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);