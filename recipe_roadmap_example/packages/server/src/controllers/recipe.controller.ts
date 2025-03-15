import { Request, Response } from 'express';
import * as recipeService from '../services/recipe.service';
import { BadRequestError } from '../utils/errors';

// Get all recipes with optional filtering
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const filters = req.query;
    
    // Convert query parameters to appropriate types
    const processedFilters: any = {};
    
    if (filters.query) processedFilters.query = filters.query as string;
    if (filters.difficulty) processedFilters.difficulty = filters.difficulty as string;
    if (filters.prepTime) processedFilters.prepTime = parseInt(filters.prepTime as string);
    if (filters.cookTime) processedFilters.cookTime = parseInt(filters.cookTime as string);
    if (filters.totalTime) processedFilters.totalTime = parseInt(filters.totalTime as string);
    
    // Handle arrays
    if (filters.tags) {
      processedFilters.tags = Array.isArray(filters.tags) 
        ? filters.tags 
        : [filters.tags as string];
    }
    
    if (filters.ingredients) {
      processedFilters.ingredients = Array.isArray(filters.ingredients) 
        ? filters.ingredients 
        : [filters.ingredients as string];
    }
    
    const recipes = await recipeService.getAllRecipes(userId, processedFilters);
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get recipes' 
    });
  }
};

// Get recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeId = req.params.id;
    
    const recipe = await recipeService.getRecipeById(recipeId, userId);
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    console.error('Error getting recipe:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get recipe' 
    });
  }
};

// Create new recipe
export const createRecipe = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeData = req.body;
    
    // Validate required fields
    if (!recipeData.title) {
      throw new BadRequestError('Recipe title is required');
    }
    
    if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
      throw new BadRequestError('Recipe must have at least one ingredient');
    }
    
    if (!recipeData.instructions || !Array.isArray(recipeData.instructions) || recipeData.instructions.length === 0) {
      throw new BadRequestError('Recipe must have at least one instruction step');
    }
    
    const recipe = await recipeService.createRecipe(recipeData, userId);
    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create recipe' 
    });
  }
};

// Update recipe
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeId = req.params.id;
    const recipeData = req.body;
    
    // Validate that there's something to update
    if (Object.keys(recipeData).length === 0) {
      throw new BadRequestError('No update data provided');
    }
    
    const recipe = await recipeService.updateRecipe(recipeId, recipeData, userId);
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update recipe' 
    });
  }
};

// Delete recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeId = req.params.id;
    
    await recipeService.deleteRecipe(recipeId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting recipe:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete recipe' 
    });
  }
};

// Get recipes by ingredients
export const getRecipesByIngredients = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    
    // Get ingredients from query params
    const { ingredients } = req.query;
    
    if (!ingredients) {
      throw new BadRequestError('Ingredients are required');
    }
    
    // Convert to array if it's a string
    const ingredientsList = Array.isArray(ingredients) 
      ? ingredients as string[] 
      : [ingredients as string];
    
    const recipes = await recipeService.getRecipesByIngredients(ingredientsList, userId);
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error: any) {
    console.error('Error getting recipes by ingredients:', error);
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get recipes by ingredients' 
    });
  }
};

// Get favorite recipes
export const getFavoriteRecipes = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    
    const recipes = await recipeService.getFavoriteRecipes(userId);
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error getting favorite recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get favorite recipes' 
    });
  }
};

// Toggle recipe favorite status
export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeId = req.params.id;
    
    const recipe = await recipeService.toggleFavorite(recipeId, userId);
    
    res.status(200).json({
      success: true,
      data: recipe,
      message: `Recipe ${recipe.isFavorite ? 'added to' : 'removed from'} favorites`
    });
  } catch (error: any) {
    console.error('Error toggling favorite status:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to toggle favorite status' 
    });
  }
}; 