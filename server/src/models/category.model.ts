import { Schema, model, Document } from 'mongoose';
import { User } from './user.model';

export interface ICategory extends Document {
  uuid: string;
  name: string;
  userId: string; // owner's uuid
}

const categorySchema = new Schema<ICategory>(
  {
    uuid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// same category name shouldn't repeat for the same user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>('Category', categorySchema);