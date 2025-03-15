import { Request, Response, NextFunction } from 'express';
import { isOperationalError, AppError } from '../utils/errors';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Global error handling middleware
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails = {};

  // Handle operational errors (our custom errors)
  if (isOperationalError(err)) {
    const appError = err as AppError;
    statusCode = appError.statusCode;
    message = appError.message;
  } 
  // Handle Mongoose validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = Object.values(err.errors).reduce((acc: any, error: any) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  } 
  // Handle Mongoose cast errors (e.g., invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } 
  // Handle Mongoose duplicate key errors
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    const keyValue = (err as any).keyValue;
    errorDetails = keyValue;
  } 
  // Handle JWT errors
  else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } 
  // Handle JWT expiration
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(Object.keys(errorDetails).length > 0 && { errors: errorDetails }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler; 