// Dietary preference options
export enum DietaryPreference {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  PESCATARIAN = 'pescatarian',
  KETO = 'keto',
  PALEO = 'paleo',
  GLUTEN_FREE = 'gluten-free',
  DAIRY_FREE = 'dairy-free',
  LOW_CARB = 'low-carb',
  LOW_FAT = 'low-fat',
  NONE = 'none'
}

// Skill levels
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

// User preferences interface
export interface UserPreferences {
  dietaryPreferences: DietaryPreference[];
  allergens: string[];
  dislikedIngredients: string[];
  cookingTime: {
    max: number; // Maximum cooking time in minutes
  };
  skillLevel: SkillLevel;
  servingSize: number; // Default number of servings
}

// User profile interface for API responses
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: UserPreferences;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
}

// Registration request payload
export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Update user profile request
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
}

// Update user preferences request
export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}

// Update password request
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirmation request
export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
} 