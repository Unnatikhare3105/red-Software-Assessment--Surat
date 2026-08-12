import { createSlice } from '@reduxjs/toolkit';
import { Product, Pagination } from '@/src/types/product.types';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  increaseStock,
  reduceStock,
} from '@/src/thunks/product.thunks';

interface ProductState {
  products: Product[];
  pagination: Pagination;
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => { state.selectedProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.uuid === action.payload.uuid);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.selectedProduct?.uuid === action.payload.uuid) state.selectedProduct = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.uuid !== action.payload);
      })
      .addCase(increaseStock.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.uuid === action.payload.uuid);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.selectedProduct?.uuid === action.payload.uuid) state.selectedProduct = action.payload;
      })
      .addCase(reduceStock.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.uuid === action.payload.uuid);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.selectedProduct?.uuid === action.payload.uuid) state.selectedProduct = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;




