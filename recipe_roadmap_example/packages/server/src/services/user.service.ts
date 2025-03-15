import { User, IUser, IUserPreferences } from '../models/user.model';
import { AppError } from '../middleware/error-handler';

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updateData: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }
): Promise<IUser> => {
  // Check if username is being updated and is unique
  if (updateData.username) {
    const existingUser = await User.findOne({ 
      username: updateData.username,
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      throw new AppError('Username already in use', 400);
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      username: updateData.username
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<IUserPreferences>
): Promise<IUser> => {
  // Get current user
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update preferences
  if (preferences.dietaryPreferences) {
    user.preferences.dietaryPreferences = preferences.dietaryPreferences;
  }
  
  if (preferences.allergens) {
    user.preferences.allergens = preferences.allergens;
  }
  
  if (preferences.dislikedIngredients) {
    user.preferences.dislikedIngredients = preferences.dislikedIngredients;
  }
  
  if (preferences.cookingTime) {
    user.preferences.cookingTime = {
      ...user.preferences.cookingTime,
      ...preferences.cookingTime
    };
  }
  
  if (preferences.skillLevel) {
    user.preferences.skillLevel = preferences.skillLevel;
  }
  
  if (preferences.servingSize) {
    user.preferences.servingSize = preferences.servingSize;
  }

  // Save user
  await user.save();

  return user;
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: string): Promise<void> => {
  const result = await User.deleteOne({ _id: userId });
  
  if (result.deletedCount === 0) {
    throw new AppError('User not found', 404);
  }
  
  // In a real application, you would also:
  // 1. Delete user's pantry items
  // 2. Delete user's shopping lists
  // 3. Delete user's reviews
  // 4. Delete user's favorites
  // Or mark them as deleted rather than actually deleting
}; 