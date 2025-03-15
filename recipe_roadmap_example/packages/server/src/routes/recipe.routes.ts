import { Router } from 'express';
import * as recipeController from '../controllers/recipe.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

// Get recipes by ingredients - must be before /:id route to avoid conflict
router.get('/by-ingredients', recipeController.getRecipesByIngredients);

// Get favorite recipes - must be before /:id route to avoid conflict
router.get('/favorites', recipeController.getFavoriteRecipes);

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Create new recipe
router.post('/', recipeController.createRecipe);

// Get single recipe
router.get('/:id', recipeController.getRecipeById);

// Update recipe
router.patch('/:id', recipeController.updateRecipe);

// Delete recipe
router.delete('/:id', recipeController.deleteRecipe);

// Toggle favorite status
router.patch('/:id/favorite', recipeController.toggleFavorite);

export default router; 