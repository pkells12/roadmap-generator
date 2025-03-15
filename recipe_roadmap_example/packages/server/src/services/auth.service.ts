import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/user.model';
import { UnauthorizedError, BadRequestError, NotFoundError } from '../utils/errors';
import config from '../config/config';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Generate JWT token
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

/**
 * Register a new user
 */
export const register = async (
  username: string,
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<IUser> => {
  // Check if user with email already exists
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new BadRequestError('Email already in use');
  }

  // Check if user with username already exists
  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    throw new BadRequestError('Username already in use');
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    verificationToken
  });

  return user;
};

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<IUser> => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return user;
};

/**
 * Verify user email
 */
export const verifyEmail = async (token: string): Promise<IUser> => {
  // Find user by verification token
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new BadRequestError('Invalid or expired token');
  }

  // Update user
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return user;
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = async (email: string): Promise<string> => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and save to user
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expiry to 10 minutes
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // Hash token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user by reset token and check if token is expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired token');
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();
};

/**
 * Update password
 */
export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  // Find user by ID
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if current password is correct
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();
}; 