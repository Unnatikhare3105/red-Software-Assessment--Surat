import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { uploadService } from '../services/upload.service';
import { ApiError } from '../utils/ApiError';

export const productController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.user!.uuid, req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.list(req.user!.uuid, req.query as any);
      res.status(200).json({ success: true, data: result.products, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getOne(req.params.uuid, req.user!.uuid);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.uuid, req.user!.uuid, req.body);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.remove(req.params.uuid, req.user!.uuid);
      res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  },

  async increaseStock(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.adjustStock(req.params.uuid, req.user!.uuid, req.body.amount);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async reduceStock(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.adjustStock(req.params.uuid, req.user!.uuid, -req.body.amount);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw ApiError.badRequest('No image file provided');
      const imageUrl = await uploadService.uploadProductImage(req.file);
      const product = await productService.update(req.params.uuid, req.user!.uuid, { imageUrl } as any);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },
};