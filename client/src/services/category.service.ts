import { api } from './api.service';
import { Category, CategoryPayload } from '@/src/types/category.types';

type ApiResponse<T> = { success: boolean; data: T };

export const categoryService = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
  getOne: (uuid: string) => api.get<ApiResponse<Category>>(`/categories/${uuid}`),
  create: (payload: CategoryPayload) => api.post<ApiResponse<Category>>('/categories', payload),
  update: (uuid: string, payload: CategoryPayload) =>
    api.patch<ApiResponse<Category>>(`/categories/${uuid}`, payload),
  remove: (uuid: string) => api.delete(`/categories/${uuid}`),
};