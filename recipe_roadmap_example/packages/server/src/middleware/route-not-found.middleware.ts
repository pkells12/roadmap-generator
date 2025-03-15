import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors';

// Middleware to handle routes that don't exist
const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route not found: ${req.originalUrl}`));
};

export default routeNotFound; 