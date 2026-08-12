import { api } from './api.service';
import { Product, ProductPayload, ProductQueryParams, Pagination } from '@/src/types/product.types';

type ApiResponse<T> = { success: boolean; data: T };
type ListResponse = { success: boolean; data: Product[]; pagination: Pagination };

export const productService = {
  list: (params: ProductQueryParams) => api.get<ListResponse>('/products', { params }),
  getOne: (uuid: string) => api.get<ApiResponse<Product>>(`/products/${uuid}`),
  create: (payload: ProductPayload) => api.post<ApiResponse<Product>>('/products', payload),
  update: (uuid: string, payload: Partial<ProductPayload>) =>
    api.patch<ApiResponse<Product>>(`/products/${uuid}`, payload),
  remove: (uuid: string) => api.delete(`/products/${uuid}`),
  increaseStock: (uuid: string, amount: number) =>
    api.patch<ApiResponse<Product>>(`/products/${uuid}/stock/increase`, { amount }),
  reduceStock: (uuid: string, amount: number) =>
    api.patch<ApiResponse<Product>>(`/products/${uuid}/stock/reduce`, { amount }),
};


