import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';

export const categoryController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.user!.uuid, req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.list(req.user!.uuid);
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getOne(req.params.uuid, req.user!.uuid);
      res.status(200).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(req.params.uuid, req.user!.uuid, req.body);
      res.status(200).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.remove(req.params.uuid, req.user!.uuid);
      res.status(200).json({ success: true, message: 'Category deleted, products unassigned' });
    } catch (err) {
      next(err);
    }
  },
};