export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  uuid: string;
  userId: string;
  name: string;
  sku: string;
  categoryId: string | null;
  description?: string;
  quantity: number;
  unitPrice: number;
  supplierName: string;
  lowStockThreshold: number;
  status: ProductStatus;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  sku: string;
  categoryId?: string | null;
  description?: string;
  quantity: number;
  unitPrice: number;
  supplierName: string;
  lowStockThreshold?: number;
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  sortBy?: 'name' | 'quantity' | 'unitPrice';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}