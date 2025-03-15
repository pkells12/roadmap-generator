// Base class for all custom errors
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request - Used when the client sends a request with invalid data
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

// 401 Unauthorized - Used when authentication is required but has failed or not been provided
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Not authorized to access this resource') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// 403 Forbidden - Used when a user is authenticated but doesn't have permission
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden: You do not have permission to access this resource') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

// 404 Not Found - Used when a requested resource doesn't exist
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// 409 Conflict - Used when a request conflicts with the current state of the server
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

// 422 Unprocessable Entity - Used when validation fails
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

// 429 Too Many Requests - Used for rate limiting
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429);
    this.name = 'TooManyRequestsError';
  }
}

// 500 Internal Server Error - Used for unexpected server errors
export class InternalServerError extends AppError {
  constructor(message: string = 'Something went wrong on the server') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

// Helper function to determine if an error is one of our custom errors
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}; 