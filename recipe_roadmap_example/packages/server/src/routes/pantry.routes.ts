import { Router } from 'express';
import * as pantryController from '../controllers/pantry.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

// Get expiring pantry items - must be before /:id route to avoid conflict
router.get('/expiring/soon', pantryController.getExpiringPantryItems);

// Get pantry items by category - must be before /:id route to avoid conflict
router.get('/category/:category', pantryController.getPantryItemsByCategory);

// Add multiple pantry items
router.post('/batch', pantryController.addMultiplePantryItems);

// Get all pantry items
router.get('/', pantryController.getAllPantryItems);

// Add new pantry item
router.post('/', pantryController.addPantryItem);

// Get single pantry item
router.get('/:id', pantryController.getPantryItemById);

// Update pantry item
router.patch('/:id', pantryController.updatePantryItem);

// Delete pantry item
router.delete('/:id', pantryController.deletePantryItem);

export default router; 