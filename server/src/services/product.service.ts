import { categoryRepository } from '../repositories/category.repository';
import { generateUuid } from '../utils/generateUUID';
import { ApiError } from '../utils/ApiError';
import { productRepository, ProductQueryOptions } from '../repositories/product.repository';
import { IProduct, StockStatus } from '../models/product.model';

function deriveStatus(quantity: number, threshold: number): StockStatus {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= threshold) return 'low_stock';
  return 'in_stock';
}

async function assertCategoryOwnership(categoryId: string | null | undefined, userId: string) {
  if (!categoryId) return; // optional field
  const category = await categoryRepository.findOneByUser(categoryId, userId);
  if (!category) throw ApiError.badRequest('Category not found or does not belong to you');
}

export const productService = {
  async create(userId: string, data: Partial<IProduct>) {
    await assertCategoryOwnership(data.categoryId, userId);

    const quantity = data.quantity ?? 0;
    const threshold = data.lowStockThreshold ?? 10;

    try {
      return await productRepository.create({
        ...data,
        uuid: generateUuid(),
        userId,
        sku: data.sku?.toUpperCase(),
        lowStockThreshold: threshold,
        status: deriveStatus(quantity, threshold),
      });
    } catch (err: any) {
      if (err.code === 11000) throw ApiError.conflict('SKU already exists for your inventory');
      throw err;
    }
  },

  //   async list(userId: string) {
  //     return productRepository.findAllByUser(userId);
  //   },
  async list(userId: string, options: ProductQueryOptions = {}) {
    const [products, total] = await productRepository.findAllByUser(userId, options);
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    return { products, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  },

  async getOne(uuid: string, userId: string) {
    const product = await productRepository.findOneByUser(uuid, userId);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  },

  async update(uuid: string, userId: string, data: Partial<IProduct>) {
    if (data.categoryId !== undefined) {
      await assertCategoryOwnership(data.categoryId, userId);
    }

    const existing = await productRepository.findOneByUser(uuid, userId);
    if (!existing) throw ApiError.notFound('Product not found');

    // recompute status if quantity or threshold is changing
    const nextQuantity = data.quantity ?? existing.quantity;
    const nextThreshold = data.lowStockThreshold ?? existing.lowStockThreshold;

    const payload = {
      ...data,
      ...(data.sku ? { sku: data.sku.toUpperCase() } : {}),
      status: deriveStatus(nextQuantity, nextThreshold),
    };

    try {
      return await productRepository.updateByUser(uuid, userId, payload);
    } catch (err: any) {
      if (err.code === 11000) throw ApiError.conflict('SKU already exists for your inventory');
      throw err;
    }
  },

  async remove(uuid: string, userId: string) {
    const deleted = await productRepository.deleteByUser(uuid, userId);
    if (!deleted) throw ApiError.notFound('Product not found');
  },

  async adjustStock(uuid: string, userId: string, delta: number) {
    const product = await productRepository.findOneByUser(uuid, userId);
    if (!product) throw ApiError.notFound('Product not found');

    if (delta < 0 && product.quantity + delta < 0) {
      throw ApiError.badRequest('Insufficient stock — cannot reduce below zero');
    }

    const updated = await productRepository.adjustStock(uuid, userId, delta);
    if (!updated) throw ApiError.badRequest('Insufficient stock — cannot reduce below zero');

    const status = deriveStatus(updated.quantity, updated.lowStockThreshold);
    if (status !== updated.status) {
      return productRepository.updateByUser(uuid, userId, { status });
    }
    return updated;
  },
};
