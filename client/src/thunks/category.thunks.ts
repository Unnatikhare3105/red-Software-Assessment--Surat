import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '@/src/services/category.service';
import { CategoryPayload } from '@/src/types/category.types';
import { extractError } from '@/src/utils/extractError';

export const fetchCategories = createAsyncThunk('category/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await categoryService.list();
    return data.data;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const createCategory = createAsyncThunk(
  'category/create',
  async (payload: CategoryPayload, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.create(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ uuid, payload }: { uuid: string; payload: CategoryPayload }, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.update(uuid, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await categoryService.remove(uuid);
      return uuid;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);