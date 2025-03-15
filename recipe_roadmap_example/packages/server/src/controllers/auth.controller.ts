import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/error-handler';
import { User } from '../models/user.model';
import mongoose from 'mongoose';
import { RequestWithUser } from '../types/custom';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return next(new AppError('Please provide username, email and password', 400));
    }

    // Register user
    const user = await authService.register(username, email, password, firstName, lastName);

    // Generate tokens
    const token = authService.generateToken((user._id as mongoose.Types.ObjectId).toString());
    const refreshToken = authService.generateRefreshToken((user._id as mongoose.Types.ObjectId).toString());

    // Remove password from response
    user.password = undefined as any;

    res.status(201).json({
      status: 'success',
      token,
      refreshToken,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Login user
    const user = await authService.login(email, password);

    // Generate tokens
    const token = authService.generateToken((user._id as mongoose.Types.ObjectId).toString());
    const refreshToken = authService.generateRefreshToken((user._id as mongoose.Types.ObjectId).toString());

    // Remove password from response
    user.password = undefined as any;

    res.status(200).json({
      status: 'success',
      token,
      refreshToken,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * @route GET /api/auth/verify-email/:token
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Verify email
    await authService.verifyEmail(token);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return next(new AppError('Please provide email', 400));
    }

    // Generate reset token
    const resetToken = await authService.generatePasswordResetToken(email);

    // In a real application, send email with reset token
    // For development, just return the token
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email',
      resetToken // Remove this in production
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate required fields
    if (!password) {
      return next(new AppError('Please provide password', 400));
    }

    // Reset password
    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 * @route PATCH /api/auth/update-password
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Cast request to include user property
    const userReq = req as RequestWithUser;
    const userId = userReq.user?._id;

    // Check if user is authenticated
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide current password and new password', 400));
    }

    // Update password
    await authService.updatePassword((userId as mongoose.Types.ObjectId).toString(), currentPassword, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token
 * @route POST /api/auth/refresh-token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    // Validate required fields
    if (!refreshToken) {
      return next(new AppError('Please provide refresh token', 400));
    }

    // Verify refresh token
    const decoded = await authService.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    const token = authService.generateToken((user._id as mongoose.Types.ObjectId).toString());
    const newRefreshToken = authService.generateRefreshToken((user._id as mongoose.Types.ObjectId).toString());

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 * @route POST /api/auth/logout
 */
export const logout = (_req: Request, res: Response) => {
  // In a stateless JWT authentication, logout is handled client-side
  // by removing the token from storage
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
}; 