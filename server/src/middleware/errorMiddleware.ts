import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message || 'Internal Server Error', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.isPublic ? err.message : 'Something went wrong. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
