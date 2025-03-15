import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import config from '../config/config';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token from Authorization header
    let token: string | undefined;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new UnauthorizedError('You are not logged in. Please log in to get access.'));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
    }

    // 4) Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token. Please log in again.'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Your token has expired. Please log in again.'));
    }
    next(error);
  }
};

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
      return next(new UnauthorizedError('You are not logged in. Please log in to get access.'));
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action.'));
    }

    next();
  };
}; 