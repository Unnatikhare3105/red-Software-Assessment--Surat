import { FilterQuery } from 'mongoose';
import { Product, IProduct } from '../models/product.model';

export interface ProductQueryOptions {
  search?: string;
  categoryId?: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  sortBy?: 'name' | 'quantity' | 'unitPrice';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const productRepository = {
  create: (data: Partial<IProduct>) => Product.create(data),

  // ALL queries below take userId — no product is ever fetched without owner scoping
  //   findAllByUser: (userId: string, filter: FilterQuery<IProduct> = {}) =>
  //     Product.find({ userId, ...filter }),
  findAllByUser: (userId: string, options: ProductQueryOptions = {}) => {
    const {
      search,
      categoryId,
      status,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = options;

    const filter: FilterQuery<IProduct> = { userId };
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    return Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
  },
  findOneByUser: (uuid: string, userId: string) => Product.findOne({ uuid, userId }),

  updateByUser: (uuid: string, userId: string, data: Partial<IProduct>) =>
    Product.findOneAndUpdate({ uuid, userId }, data, { new: true }),

  deleteByUser: (uuid: string, userId: string) => Product.findOneAndDelete({ uuid, userId }),

  // used when a category is deleted — unassigns instead of blocking
  unassignCategory: (userId: string, categoryId: string) =>
    Product.updateMany({ userId, categoryId }, { categoryId: null }),

  countByUser: (userId: string, filter: FilterQuery<IProduct> = {}) =>
    Product.countDocuments({ userId, ...filter }),

  getStats: async (userId: string) => {
    const [result] = await Product.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockQuantity: { $sum: '$quantity' },
          lowStockItems: { $sum: { $cond: [{ $eq: ['$status', 'low_stock'] }, 1, 0] } },
          outOfStockItems: { $sum: { $cond: [{ $eq: ['$status', 'out_of_stock'] }, 1, 0] } },
        },
      },
    ]);
    return (
      result ?? { totalProducts: 0, totalStockQuantity: 0, lowStockItems: 0, outOfStockItems: 0 }
    );
  },

  // negative-guard at DB level: when reducing, only matches if enough quantity exists (atomic, race-safe)
  adjustStock: (uuid: string, userId: string, delta: number) => {
    const filter: FilterQuery<IProduct> = { uuid, userId };
    if (delta < 0) filter.quantity = { $gte: Math.abs(delta) };
    return Product.findOneAndUpdate(filter, { $inc: { quantity: delta } }, { new: true });
  },
};
