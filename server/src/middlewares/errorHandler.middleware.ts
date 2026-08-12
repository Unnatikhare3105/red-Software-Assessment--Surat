import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { config } from '../config/env.config';

// 404 handler — placed after all routes
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler — must be the LAST middleware registered
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : 'Something went wrong';
// console.log('DEBUG >>>', JSON.stringify({ query: req.query, details: isApiError ? (err as any).details : undefined }, null, 2));
logger.error(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`, {
  stack: err instanceof Error ? err.stack : undefined,
});

  res.status(statusCode).json({
    success: false,
    message,
    ...(isApiError && err.details ? { details: err.details } : {}),
    ...(config.env !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
  });
}

