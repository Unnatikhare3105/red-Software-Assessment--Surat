import { productRepository } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';

export const dashboardService = {
  async getStats(userId: string) {
    const [productStats, totalCategories] = await Promise.all([
      productRepository.getStats(userId),
      categoryRepository.countByUser(userId),
    ]);

    return {
      totalProducts: productStats.totalProducts,
      totalCategories,
      totalStockQuantity: productStats.totalStockQuantity,
      lowStockItems: productStats.lowStockItems,
      outOfStockItems: productStats.outOfStockItems,
    };
  },
};