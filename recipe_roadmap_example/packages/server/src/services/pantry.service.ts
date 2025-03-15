import { PantryItem, IPantryItem, PantryItemStatus } from '../models/pantry-item.model';
import { AppError } from '../middleware/error-handler';

/**
 * Get all pantry items for a user
 */
export const getAllPantryItems = async (userId: string): Promise<IPantryItem[]> => {
  return PantryItem.find({ user: userId }).populate('ingredient');
};

/**
 * Get pantry item by ID
 */
export const getPantryItemById = async (itemId: string, userId: string): Promise<IPantryItem> => {
  const pantryItem = await PantryItem.findOne({ _id: itemId, user: userId }).populate('ingredient');
  
  if (!pantryItem) {
    throw new AppError('Pantry item not found', 404);
  }
  
  return pantryItem;
};

/**
 * Add new pantry item
 */
export const addPantryItem = async (
  userId: string,
  itemData: {
    ingredient: string;
    quantity: number;
    unit: string;
    expirationDate?: Date;
    purchaseDate?: Date;
    storageLocation?: string;
    notes?: string;
  }
): Promise<IPantryItem> => {
  // Check if user already has this ingredient in pantry
  const existingItem = await PantryItem.findOne({
    user: userId,
    ingredient: itemData.ingredient
  });

  if (existingItem) {
    throw new AppError('This ingredient is already in your pantry. Please update the existing item instead.', 400);
  }

  // Create new pantry item
  const pantryItem = await PantryItem.create({
    user: userId,
    ingredient: itemData.ingredient,
    quantity: itemData.quantity,
    unit: itemData.unit,
    expirationDate: itemData.expirationDate,
    purchaseDate: itemData.purchaseDate || new Date(),
    storageLocation: itemData.storageLocation,
    notes: itemData.notes
  });

  return pantryItem.populate('ingredient');
};

/**
 * Update pantry item
 */
export const updatePantryItem = async (
  itemId: string,
  userId: string,
  updateData: {
    quantity?: number;
    unit?: string;
    expirationDate?: Date;
    purchaseDate?: Date;
    status?: PantryItemStatus;
    storageLocation?: string;
    notes?: string;
  }
): Promise<IPantryItem> => {
  // Find and update pantry item
  const pantryItem = await PantryItem.findOneAndUpdate(
    { _id: itemId, user: userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('ingredient');

  if (!pantryItem) {
    throw new AppError('Pantry item not found', 404);
  }

  return pantryItem;
};

/**
 * Delete pantry item
 */
export const deletePantryItem = async (itemId: string, userId: string): Promise<void> => {
  const result = await PantryItem.deleteOne({ _id: itemId, user: userId });

  if (result.deletedCount === 0) {
    throw new AppError('Pantry item not found', 404);
  }
};

/**
 * Get pantry items by category
 */
export const getPantryItemsByCategory = async (
  userId: string,
  category: string
): Promise<IPantryItem[]> => {
  return PantryItem.find({ user: userId })
    .populate({
      path: 'ingredient',
      match: { category }
    })
    .then(items => items.filter(item => item.ingredient)); // Filter out items where ingredient is null
};

/**
 * Get expiring pantry items
 */
export const getExpiringPantryItems = async (
  userId: string,
  daysThreshold: number = 7
): Promise<IPantryItem[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return PantryItem.find({
    user: userId,
    expirationDate: { $ne: null, $lte: thresholdDate, $gte: new Date() }
  }).populate('ingredient');
};

/**
 * Add multiple pantry items
 */
export const addMultiplePantryItems = async (
  userId: string,
  items: Array<{
    ingredient: string;
    quantity: number;
    unit: string;
    expirationDate?: Date;
    purchaseDate?: Date;
    storageLocation?: string;
    notes?: string;
  }>
): Promise<IPantryItem[]> => {
  // Get all ingredients that user already has
  const existingIngredients = await PantryItem.find({
    user: userId,
    ingredient: { $in: items.map(item => item.ingredient) }
  }).select('ingredient');

  const existingIngredientIds = existingIngredients.map(item => 
    item.ingredient.toString()
  );

  // Filter out items that user already has
  const newItems = items.filter(
    item => !existingIngredientIds.includes(item.ingredient)
  );

  if (newItems.length === 0) {
    throw new AppError('All ingredients are already in your pantry', 400);
  }

  // Create new pantry items
  const pantryItems = await PantryItem.insertMany(
    newItems.map(item => ({
      user: userId,
      ingredient: item.ingredient,
      quantity: item.quantity,
      unit: item.unit,
      expirationDate: item.expirationDate,
      purchaseDate: item.purchaseDate || new Date(),
      storageLocation: item.storageLocation,
      notes: item.notes
    }))
  );

  return PantryItem.populate(pantryItems, { path: 'ingredient' });
}; 