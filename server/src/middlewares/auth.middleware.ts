import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { redisClient } from '../config/redis.config';
import { ApiError } from '../utils/ApiError';

export async function protect(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization; // ONLY header, no cookie-parser
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = header.split(' ')[1];

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) throw ApiError.unauthorized('Token has been revoked');

    const decoded = verifyAccessToken(token);

    req.user = { id: decoded._id, uuid: decoded.uuid, email: decoded.email, role: decoded.role };
    req.token = token;
    req.tokenExp = decoded.exp as number;

    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}