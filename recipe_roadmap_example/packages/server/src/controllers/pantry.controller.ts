import { Request, Response, NextFunction } from 'express';
import * as pantryService from '../services/pantry.service';
import { AppError } from '../middleware/error-handler';

/**
 * Get all pantry items
 * @route GET /api/pantry
 */
export const getAllPantryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const pantryItems = await pantryService.getAllPantryItems(userId.toString());

    res.status(200).json({
      status: 'success',
      results: pantryItems.length,
      data: {
        pantryItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pantry item by ID
 * @route GET /api/pantry/:id
 */
export const getPantryItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const itemId = req.params.id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const pantryItem = await pantryService.getPantryItemById(itemId, userId.toString());

    res.status(200).json({
      status: 'success',
      data: {
        pantryItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add new pantry item
 * @route POST /api/pantry
 */
export const addPantryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const {
      ingredient,
      quantity,
      unit,
      expirationDate,
      purchaseDate,
      storageLocation,
      notes
    } = req.body;

    // Validate required fields
    if (!ingredient || !quantity || !unit) {
      return next(new AppError('Please provide ingredient, quantity, and unit', 400));
    }

    const pantryItem = await pantryService.addPantryItem(userId.toString(), {
      ingredient,
      quantity,
      unit,
      expirationDate,
      purchaseDate,
      storageLocation,
      notes
    });

    res.status(201).json({
      status: 'success',
      data: {
        pantryItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add multiple pantry items
 * @route POST /api/pantry/batch
 */
export const addMultiplePantryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const { items } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Please provide an array of items', 400));
    }

    // Validate each item
    for (const item of items) {
      if (!item.ingredient || !item.quantity || !item.unit) {
        return next(new AppError('Each item must have ingredient, quantity, and unit', 400));
      }
    }

    const pantryItems = await pantryService.addMultiplePantryItems(userId.toString(), items);

    res.status(201).json({
      status: 'success',
      results: pantryItems.length,
      data: {
        pantryItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update pantry item
 * @route PATCH /api/pantry/:id
 */
export const updatePantryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const itemId = req.params.id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const {
      quantity,
      unit,
      expirationDate,
      purchaseDate,
      status,
      storageLocation,
      notes
    } = req.body;

    const pantryItem = await pantryService.updatePantryItem(itemId, userId.toString(), {
      quantity,
      unit,
      expirationDate,
      purchaseDate,
      status,
      storageLocation,
      notes
    });

    res.status(200).json({
      status: 'success',
      data: {
        pantryItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pantry item
 * @route DELETE /api/pantry/:id
 */
export const deletePantryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const itemId = req.params.id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    await pantryService.deletePantryItem(itemId, userId.toString());

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pantry items by category
 * @route GET /api/pantry/category/:category
 */
export const getPantryItemsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const category = req.params.category;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    const pantryItems = await pantryService.getPantryItemsByCategory(userId.toString(), category);

    res.status(200).json({
      status: 'success',
      results: pantryItems.length,
      data: {
        pantryItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expiring pantry items
 * @route GET /api/pantry/expiring/soon
 */
export const getExpiringPantryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return next(new AppError('You are not logged in', 401));
    }

    // Get days threshold from query params, default to 7
    const daysThreshold = req.query.days ? parseInt(req.query.days as string, 10) : 7;

    const pantryItems = await pantryService.getExpiringPantryItems(userId.toString(), daysThreshold);

    res.status(200).json({
      status: 'success',
      results: pantryItems.length,
      data: {
        pantryItems
      }
    });
  } catch (error) {
    next(error);
  }
}; 