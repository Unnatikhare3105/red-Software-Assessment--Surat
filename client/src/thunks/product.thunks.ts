import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '@/src/services/product.service';
import { ProductPayload, ProductQueryParams } from '@/src/types/product.types';
import { extractError } from '@/src/utils/extractError';

export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async (params: ProductQueryParams, { rejectWithValue }) => {
    try {
      const { data } = await productService.list(params);
      return { products: data.data, pagination: data.pagination };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchOne',
  async (uuid: string, { rejectWithValue }) => {
    try {
      const { data } = await productService.getOne(uuid);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/create',
  async (payload: ProductPayload, { rejectWithValue }) => {
    try {
      const { data } = await productService.create(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/update',
  async ({ uuid, payload }: { uuid: string; payload: Partial<ProductPayload> }, { rejectWithValue }) => {
    try {
      const { data } = await productService.update(uuid, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await productService.remove(uuid);
      return uuid;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const increaseStock = createAsyncThunk(
  'product/increaseStock',
  async ({ uuid, amount }: { uuid: string; amount: number }, { rejectWithValue }) => {
    try {
      const { data } = await productService.increaseStock(uuid, amount);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const reduceStock = createAsyncThunk(
  'product/reduceStock',
  async ({ uuid, amount }: { uuid: string; amount: number }, { rejectWithValue }) => {
    try {
      const { data } = await productService.reduceStock(uuid, amount);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

