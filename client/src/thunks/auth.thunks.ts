import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authService } from '@/src/services/auth.service';
import { LoginPayload, RegisterPayload } from '@/src/types/auth.types';

function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message || 'Something went wrong';
  }
  return 'Something went wrong';
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});


