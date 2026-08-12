import { User, IUser } from '../models/user.model';

export const userRepository = {
  create: (data: Partial<IUser>) => User.create(data),
  findByEmail: (email: string) => User.findOne({ email }).select('+password'),
  findByUuid: (uuid: string) => User.findOne({ uuid }),
};