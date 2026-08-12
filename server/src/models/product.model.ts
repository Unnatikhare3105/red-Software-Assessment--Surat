import { Schema, model, Document } from 'mongoose';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface IProduct extends Document {
  uuid: string;
  userId: string;        // owner's uuid — ownership check base
  name: string;
  sku: string;
  categoryId: string | null;    // Category uuid
  description?: string;
  quantity: number;
  unitPrice: number;
  supplierName: string;
  imageUrl?: string | null;
  lowStockThreshold: number;
  status: StockStatus;
}

const productSchema = new Schema<IProduct>(
  {
    uuid: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    categoryId: { type: String, required: false, default: null, index: true },
    description: { type: String, trim: true, default: '' },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    supplierName: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: null },
    lowStockThreshold: { type: Number, min: 0, default: 10 },
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
  },
  { timestamps: true }
);

// SKU unique PER USER, not globally
productSchema.index({ userId: 1, sku: 1 }, { unique: true });
// search + filter support
productSchema.index({ userId: 1, status: 1 });
productSchema.index({ userId: 1, categoryId: 1 });
productSchema.index({ name: 'text', sku: 'text' });

export const Product = model<IProduct>('Product', productSchema);