import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.user!.uuid);
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};