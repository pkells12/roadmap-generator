import { Request, Response } from 'express';
import * as shoppingListService from '../services/shopping-list.service';
import { BadRequestError } from '../utils/errors';

// Get user's shopping list
export const getShoppingList = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    
    const shoppingList = await shoppingListService.getShoppingList(userId);
    
    res.status(200).json({
      success: true,
      data: shoppingList
    });
  } catch (error) {
    console.error('Error getting shopping list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get shopping list' 
    });
  }
};

// Add item to shopping list
export const addShoppingListItem = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const itemData = req.body;
    
    // Validate required fields
    if (!itemData.name) {
      throw new BadRequestError('Item name is required');
    }
    
    const shoppingList = await shoppingListService.addShoppingListItem(userId, itemData);
    
    res.status(201).json({
      success: true,
      data: shoppingList
    });
  } catch (error: any) {
    console.error('Error adding item to shopping list:', error);
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to shopping list' 
    });
  }
};

// Add multiple items to shopping list
export const addMultipleShoppingListItems = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const { items } = req.body;
    
    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestError('No items provided');
    }
    
    const shoppingList = await shoppingListService.addMultipleShoppingListItems(userId, items);
    
    res.status(201).json({
      success: true,
      data: shoppingList
    });
  } catch (error: any) {
    console.error('Error adding items to shopping list:', error);
    
    if (error.name === 'BadRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add items to shopping list' 
    });
  }
};

// Update shopping list item
export const updateShoppingListItem = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const itemId = req.params.id;
    const itemData = req.body;
    
    // Validate that there's something to update
    if (Object.keys(itemData).length === 0) {
      throw new BadRequestError('No update data provided');
    }
    
    const shoppingList = await shoppingListService.updateShoppingListItem(userId, itemId, itemData);
    
    res.status(200).json({
      success: true,
      data: shoppingList
    });
  } catch (error: any) {
    console.error('Error updating shopping list item:', error);
    
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
      message: 'Failed to update shopping list item' 
    });
  }
};

// Remove item from shopping list
export const removeShoppingListItem = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const itemId = req.params.id;
    
    const shoppingList = await shoppingListService.removeShoppingListItem(userId, itemId);
    
    res.status(200).json({
      success: true,
      data: shoppingList,
      message: 'Item removed from shopping list'
    });
  } catch (error: any) {
    console.error('Error removing item from shopping list:', error);
    
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
      message: 'Failed to remove item from shopping list' 
    });
  }
};

// Clear shopping list
export const clearShoppingList = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    
    const shoppingList = await shoppingListService.clearShoppingList(userId);
    
    res.status(200).json({
      success: true,
      data: shoppingList,
      message: 'Shopping list cleared'
    });
  } catch (error: any) {
    console.error('Error clearing shopping list:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear shopping list' 
    });
  }
};

// Toggle item checked status
export const toggleItemChecked = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const itemId = req.params.id;
    
    const shoppingList = await shoppingListService.toggleItemChecked(userId, itemId);
    
    res.status(200).json({
      success: true,
      data: shoppingList
    });
  } catch (error: any) {
    console.error('Error toggling item checked status:', error);
    
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
      message: 'Failed to toggle item checked status' 
    });
  }
};

// Add recipe ingredients to shopping list
export const addRecipeIngredientsToShoppingList = async (req: Request, res: Response) => {
  try {
    // Check if user is logged in
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    
    if (!recipeId) {
      throw new BadRequestError('Recipe ID is required');
    }
    
    try {
      const shoppingList = await shoppingListService.addRecipeIngredientsToShoppingList(userId, recipeId);
      
      res.status(201).json({
        success: true,
        data: shoppingList,
        message: 'Recipe ingredients added to shopping list'
      });
    } catch (error) {
      // This is a placeholder until the service is implemented
      res.status(501).json({
        success: false,
        message: 'This feature is not implemented yet'
      });
    }
  } catch (error: any) {
    console.error('Error adding recipe ingredients to shopping list:', error);
    
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
      message: 'Failed to add recipe ingredients to shopping list' 
    });
  }
}; 