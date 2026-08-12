import { categoryRepository } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';
import { generateUuid } from '../utils/generateUUID';
import { ApiError } from '../utils/ApiError';

export const categoryService = {
  async create(userId: string, data: { name: string }) {
    try {
      return await categoryRepository.create({ uuid: generateUuid(), userId, name: data.name });
    } catch (err: any) {
      if (err.code === 11000) throw ApiError.conflict('Category name already exists');
      throw err;
    }
  },

  async list(userId: string) {
    return categoryRepository.findAllByUser(userId);
  },

  async getOne(uuid: string, userId: string) {
    const category = await categoryRepository.findOneByUser(uuid, userId);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  },

  async update(uuid: string, userId: string, data: { name: string }) {
    try {
      const updated = await categoryRepository.updateByUser(uuid, userId, data);
      if (!updated) throw ApiError.notFound('Category not found');
      return updated;
    } catch (err: any) {
      if (err.code === 11000) throw ApiError.conflict('Category name already exists');
      throw err;
    }
  },

  async remove(uuid: string, userId: string) {
    const category = await categoryRepository.findOneByUser(uuid, userId);
    if (!category) throw ApiError.notFound('Category not found');

    // unassign instead of blocking — real-world friendly since categoryId is optional
    await productRepository.unassignCategory(userId, uuid);
    await categoryRepository.deleteByUser(uuid, userId);
  },
};