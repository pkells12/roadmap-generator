import { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler';

// Handle 404 errors for routes that don't exist
export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Route not found - ${req.originalUrl}`, 404));
}; 