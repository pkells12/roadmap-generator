import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../middleware/error-handler';

/**
 * Get current user
 * @route GET /api/users/me
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const user = await userService.getUserById(userId.toString());

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PATCH /api/users/me
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const { firstName, lastName, username } = req.body;

    const user = await userService.updateUserProfile(userId.toString(), {
      firstName,
      lastName,
      username
    });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 * @route PATCH /api/users/me/preferences
 */
export const updateUserPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const { preferences } = req.body;

    if (!preferences) {
      return next(new AppError('Please provide preferences', 400));
    }

    const user = await userService.updateUserPreferences(userId.toString(), preferences);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/me
 */
export const deleteUserAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    await userService.deleteUserAccount(userId.toString());

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 