import Recipe from '../models/recipe.model';
import { NotFoundError, BadRequestError } from '../utils/errors';
import mongoose from 'mongoose';

// Get all recipes with optional filtering
export const getAllRecipes = async (
  userId: string,
  filters: {
    query?: string;
    tags?: string[];
    ingredients?: string[];
    difficulty?: string;
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
  } = {}
) => {
  const { query, tags, ingredients, difficulty, prepTime, cookTime, totalTime } = filters;
  
  // Build filter object
  const filterObj: any = { userId };
  
  // Text search
  if (query) {
    filterObj.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Filter by tags
  if (tags && tags.length > 0) {
    filterObj.tags = { $all: tags };
  }
  
  // Filter by ingredients
  if (ingredients && ingredients.length > 0) {
    filterObj['ingredients.name'] = { $all: ingredients };
  }
  
  // Filter by difficulty
  if (difficulty) {
    filterObj.difficulty = difficulty;
  }
  
  // Filter by time constraints
  if (prepTime) {
    filterObj.prepTime = { $lte: prepTime };
  }
  
  if (cookTime) {
    filterObj.cookTime = { $lte: cookTime };
  }
  
  if (totalTime) {
    filterObj.totalTime = { $lte: totalTime };
  }
  
  return await Recipe.find(filterObj).sort({ createdAt: -1 });
};

// Get recipe by ID
export const getRecipeById = async (recipeId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw new BadRequestError('Invalid recipe ID');
  }
  
  const recipe = await Recipe.findOne({ _id: recipeId, userId });
  
  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }
  
  return recipe;
};

// Create new recipe
export const createRecipe = async (recipeData: any, userId: string) => {
  // Check if recipe with same title already exists for this user
  const existingRecipe = await Recipe.findOne({ 
    title: recipeData.title, 
    userId 
  });
  
  if (existingRecipe) {
    throw new BadRequestError('A recipe with this title already exists');
  }
  
  // Calculate total time if not provided
  if (!recipeData.totalTime && recipeData.prepTime && recipeData.cookTime) {
    recipeData.totalTime = recipeData.prepTime + recipeData.cookTime;
  }
  
  // Create new recipe
  const recipe = new Recipe({
    ...recipeData,
    userId
  });
  
  return await recipe.save();
};

// Update recipe
export const updateRecipe = async (recipeId: string, recipeData: any, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw new BadRequestError('Invalid recipe ID');
  }
  
  // Check if recipe exists
  const recipe = await Recipe.findOne({ _id: recipeId, userId });
  
  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }
  
  // Check if updating to a title that already exists (excluding this recipe)
  if (recipeData.title) {
    const existingRecipe = await Recipe.findOne({ 
      title: recipeData.title, 
      userId,
      _id: { $ne: recipeId }
    });
    
    if (existingRecipe) {
      throw new BadRequestError('A recipe with this title already exists');
    }
  }
  
  // Calculate total time if prep and cook time are provided
  if (!recipeData.totalTime && recipeData.prepTime && recipeData.cookTime) {
    recipeData.totalTime = recipeData.prepTime + recipeData.cookTime;
  }
  
  // Update recipe
  const updatedRecipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, userId },
    { $set: recipeData },
    { new: true, runValidators: true }
  );
  
  if (!updatedRecipe) {
    throw new NotFoundError('Recipe not found');
  }
  
  return updatedRecipe;
};

// Delete recipe
export const deleteRecipe = async (recipeId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw new BadRequestError('Invalid recipe ID');
  }
  
  const recipe = await Recipe.findOneAndDelete({ _id: recipeId, userId });
  
  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }
  
  return recipe;
};

// Get recipes by ingredients (for suggesting recipes based on pantry)
export const getRecipesByIngredients = async (ingredients: string[], userId: string) => {
  // Find recipes that contain any of the provided ingredients
  const recipes = await Recipe.find({
    userId,
    'ingredients.name': { $in: ingredients }
  });
  
  // Calculate match percentage for each recipe
  const recipesWithMatchScore = recipes.map(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
    const matchedIngredients = ingredients.filter(ing => 
      recipeIngredients.includes(ing.toLowerCase())
    );
    
    const matchPercentage = (matchedIngredients.length / recipeIngredients.length) * 100;
    
    return {
      ...recipe.toObject(),
      matchPercentage: Math.round(matchPercentage),
      matchedIngredients: matchedIngredients.length,
      totalIngredients: recipeIngredients.length
    };
  });
  
  // Sort by match percentage (highest first)
  return recipesWithMatchScore.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Get favorite recipes
export const getFavoriteRecipes = async (userId: string) => {
  return await Recipe.find({ userId, isFavorite: true }).sort({ createdAt: -1 });
};

// Toggle recipe favorite status
export const toggleFavorite = async (recipeId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw new BadRequestError('Invalid recipe ID');
  }
  
  const recipe = await Recipe.findOne({ _id: recipeId, userId });
  
  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }
  
  recipe.isFavorite = !recipe.isFavorite;
  return await recipe.save();
}; 