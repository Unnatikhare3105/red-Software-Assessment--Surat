import { Category, ICategory } from '../models/category.model';

export const categoryRepository = {
  create: (data: Partial<ICategory>) => Category.create(data),

  // every read/write scoped by userId — ownership enforced here
  findAllByUser: (userId: string) => Category.find({ userId }),
  findOneByUser: (uuid: string, userId: string) => Category.findOne({ uuid, userId }),
  updateByUser: (uuid: string, userId: string, data: Partial<ICategory>) =>
    Category.findOneAndUpdate({ uuid, userId }, data, { new: true }),
  deleteByUser: (uuid: string, userId: string) => Category.findOneAndDelete({ uuid, userId }),

  countByUser: (userId: string) => Category.countDocuments({ userId }),
};