import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  sku: Joi.string().trim().min(2).max(30).required(),
  categoryId: Joi.string().uuid().allow(null).optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
  quantity: Joi.number().integer().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  supplierName: Joi.string().trim().min(2).max(100).required(),
  lowStockThreshold: Joi.number().integer().min(0).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  sku: Joi.string().trim().min(2).max(30).optional(),
  categoryId: Joi.string().uuid().allow(null).optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
  quantity: Joi.number().integer().min(0).optional(),
  unitPrice: Joi.number().min(0).optional(),
  supplierName: Joi.string().trim().min(2).max(100).optional(),
  lowStockThreshold: Joi.number().integer().min(0).optional(),
}).min(1);  // at least one field required on update

export const stockAdjustSchema = Joi.object({
  amount: Joi.number().integer().positive().required(), // always positive; direction decided by route
}); 

export const productQuerySchema = Joi.object({
  search: Joi.string().trim().max(100).allow('').optional(),
  categoryId: Joi.string().uuid().optional(),
  status: Joi.string().valid('in_stock', 'low_stock', 'out_of_stock').optional(),
  sortBy: Joi.string().valid('name', 'quantity', 'unitPrice').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});