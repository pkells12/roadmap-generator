import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

// Get current user
router.get('/me', userController.getCurrentUser);

// Update user profile
router.patch('/me', userController.updateUserProfile);

// Update user password
router.patch('/me/password', (req, res) => {
  // Placeholder - to be implemented
  res.status(200).json({ message: 'Update user password endpoint' });
});

// Update user preferences
router.patch('/me/preferences', userController.updateUserPreferences);

// Delete user account
router.delete('/me', userController.deleteUserAccount);

export default router; 