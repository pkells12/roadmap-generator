import ShoppingList from '../models/shopping-list.model';
import { NotFoundError, BadRequestError } from '../utils/errors';
import mongoose from 'mongoose';

// Get user's shopping list
export const getShoppingList = async (userId: string) => {
  const shoppingList = await ShoppingList.findOne({ userId });
  
  // If no shopping list exists, create an empty one
  if (!shoppingList) {
    return await ShoppingList.create({
      userId,
      items: []
    });
  }
  
  return shoppingList;
};

// Add item to shopping list
export const addShoppingListItem = async (userId: string, itemData: any) => {
  // Validate required fields
  if (!itemData.name) {
    throw new BadRequestError('Item name is required');
  }
  
  let shoppingList = await ShoppingList.findOne({ userId });
  
  // If no shopping list exists, create one
  if (!shoppingList) {
    shoppingList = await ShoppingList.create({
      userId,
      items: []
    });
  }
  
  // Check if item already exists
  const existingItemIndex = shoppingList.items.findIndex(
    (item: any) => item.name.toLowerCase() === itemData.name.toLowerCase()
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item
    shoppingList.items[existingItemIndex] = {
      ...shoppingList.items[existingItemIndex].toObject(),
      ...itemData,
      // If quantity is provided, add it to existing quantity
      quantity: itemData.quantity 
        ? shoppingList.items[existingItemIndex].quantity + itemData.quantity 
        : shoppingList.items[existingItemIndex].quantity
    };
  } else {
    // Add new item
    shoppingList.items.push({
      name: itemData.name,
      quantity: itemData.quantity || 1,
      unit: itemData.unit || '',
      category: itemData.category || 'Other',
      checked: itemData.checked || false
    });
  }
  
  await shoppingList.save();
  return shoppingList;
};

// Add multiple items to shopping list
export const addMultipleShoppingListItems = async (userId: string, items: any[]) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new BadRequestError('No items provided');
  }
  
  let shoppingList = await ShoppingList.findOne({ userId });
  
  // If no shopping list exists, create one
  if (!shoppingList) {
    shoppingList = await ShoppingList.create({
      userId,
      items: []
    });
  }
  
  // Process each item
  for (const itemData of items) {
    if (!itemData.name) {
      continue; // Skip items without a name
    }
    
    // Check if item already exists
    const existingItemIndex = shoppingList.items.findIndex(
      (item: any) => item.name.toLowerCase() === itemData.name.toLowerCase()
    );
    
    if (existingItemIndex !== -1) {
      // Update existing item
      shoppingList.items[existingItemIndex] = {
        ...shoppingList.items[existingItemIndex].toObject(),
        ...itemData,
        // If quantity is provided, add it to existing quantity
        quantity: itemData.quantity 
          ? shoppingList.items[existingItemIndex].quantity + itemData.quantity 
          : shoppingList.items[existingItemIndex].quantity
      };
    } else {
      // Add new item
      shoppingList.items.push({
        name: itemData.name,
        quantity: itemData.quantity || 1,
        unit: itemData.unit || '',
        category: itemData.category || 'Other',
        checked: itemData.checked || false
      });
    }
  }
  
  await shoppingList.save();
  return shoppingList;
};

// Update shopping list item
export const updateShoppingListItem = async (userId: string, itemId: string, itemData: any) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError('Invalid item ID');
  }
  
  const shoppingList = await ShoppingList.findOne({ userId });
  
  if (!shoppingList) {
    throw new NotFoundError('Shopping list not found');
  }
  
  // Find the item
  const itemIndex = shoppingList.items.findIndex(
    (item: any) => item._id.toString() === itemId
  );
  
  if (itemIndex === -1) {
    throw new NotFoundError('Item not found in shopping list');
  }
  
  // Update the item
  shoppingList.items[itemIndex] = {
    ...shoppingList.items[itemIndex].toObject(),
    ...itemData
  };
  
  await shoppingList.save();
  return shoppingList;
};

// Remove item from shopping list
export const removeShoppingListItem = async (userId: string, itemId: string) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError('Invalid item ID');
  }
  
  const shoppingList = await ShoppingList.findOne({ userId });
  
  if (!shoppingList) {
    throw new NotFoundError('Shopping list not found');
  }
  
  // Find the item
  const itemIndex = shoppingList.items.findIndex(
    (item: any) => item._id.toString() === itemId
  );
  
  if (itemIndex === -1) {
    throw new NotFoundError('Item not found in shopping list');
  }
  
  // Remove the item
  shoppingList.items.splice(itemIndex, 1);
  
  await shoppingList.save();
  return shoppingList;
};

// Clear shopping list
export const clearShoppingList = async (userId: string) => {
  const shoppingList = await ShoppingList.findOne({ userId });
  
  if (!shoppingList) {
    throw new NotFoundError('Shopping list not found');
  }
  
  shoppingList.items = [];
  
  await shoppingList.save();
  return shoppingList;
};

// Toggle item checked status
export const toggleItemChecked = async (userId: string, itemId: string) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError('Invalid item ID');
  }
  
  const shoppingList = await ShoppingList.findOne({ userId });
  
  if (!shoppingList) {
    throw new NotFoundError('Shopping list not found');
  }
  
  // Find the item
  const itemIndex = shoppingList.items.findIndex(
    (item: any) => item._id.toString() === itemId
  );
  
  if (itemIndex === -1) {
    throw new NotFoundError('Item not found in shopping list');
  }
  
  // Toggle checked status
  shoppingList.items[itemIndex].checked = !shoppingList.items[itemIndex].checked;
  
  await shoppingList.save();
  return shoppingList;
};

// Add recipe ingredients to shopping list
export const addRecipeIngredientsToShoppingList = async (userId: string, recipeId: string) => {
  // This would typically fetch the recipe and add its ingredients to the shopping list
  // For now, we'll just return a placeholder implementation
  throw new Error('Not implemented yet');
}; 