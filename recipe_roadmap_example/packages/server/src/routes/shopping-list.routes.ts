import { Router } from 'express';
import * as shoppingListController from '../controllers/shopping-list.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

// Get shopping list
router.get('/', shoppingListController.getShoppingList);

// Add item to shopping list
router.post('/', shoppingListController.addShoppingListItem);

// Add multiple items to shopping list
router.post('/batch', shoppingListController.addMultipleShoppingListItems);

// Clear shopping list
router.delete('/clear', shoppingListController.clearShoppingList);

// Add recipe ingredients to shopping list
router.post('/recipe/:recipeId', shoppingListController.addRecipeIngredientsToShoppingList);

// Update shopping list item
router.patch('/:id', shoppingListController.updateShoppingListItem);

// Toggle item checked status
router.patch('/:id/toggle', shoppingListController.toggleItemChecked);

// Remove item from shopping list
router.delete('/:id', shoppingListController.removeShoppingListItem);

export default router; 