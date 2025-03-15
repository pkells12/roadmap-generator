import mongoose, { Document, Schema } from 'mongoose';

// Ingredient categories
export enum IngredientCategory {
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  MEAT = 'meat',
  POULTRY = 'poultry',
  SEAFOOD = 'seafood',
  DAIRY = 'dairy',
  GRAIN = 'grain',
  LEGUME = 'legume',
  NUT = 'nut',
  HERB = 'herb',
  SPICE = 'spice',
  BAKING = 'baking',
  OIL = 'oil',
  CONDIMENT = 'condiment',
  SWEETENER = 'sweetener',
  BEVERAGE = 'beverage',
  OTHER = 'other'
}

// Unit of measurement
export enum UnitOfMeasurement {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  TEASPOON = 'tsp',
  TABLESPOON = 'tbsp',
  CUP = 'cup',
  PINCH = 'pinch',
  OUNCE = 'oz',
  POUND = 'lb',
  FLUID_OUNCE = 'fl oz',
  ITEM = 'item',
  SLICE = 'slice',
  NONE = ''
}

// Nutritional information interface
export interface INutritionalInfo {
  calories: number; // per 100g
  protein: number; // in grams per 100g
  carbs: number; // in grams per 100g
  fat: number; // in grams per 100g
  fiber: number; // in grams per 100g
  sugar: number; // in grams per 100g
}

// Ingredient document interface
export interface IIngredient extends Document {
  name: string;
  category: IngredientCategory;
  shelfLifeDays?: number;
  defaultUnit?: string;
  image?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  commonSubstitutes?: string[]; // IDs of other ingredients
  storageInstructions?: string;
  sheflLife?: {
    pantry?: number; // days
    refrigerator?: number; // days
    freezer?: number; // days
  };
  allergies?: string[]; // Types of allergies this ingredient can trigger
  dietaryRestrictions?: string[]; // Dietary restrictions this ingredient violates
  createdAt: Date;
  updatedAt: Date;
}

// Ingredient schema
const ingredientSchema = new Schema<IIngredient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    category: {
      type: String,
      enum: Object.values(IngredientCategory),
      required: true
    },
    shelfLifeDays: {
      type: Number,
      min: 0
    },
    defaultUnit: {
      type: String,
      trim: true
    },
    image: {
      type: String
    },
    nutritionalInfo: {
      calories: {
        type: Number,
        min: 0
      },
      protein: {
        type: Number,
        min: 0
      },
      carbs: {
        type: Number,
        min: 0
      },
      fat: {
        type: Number,
        min: 0
      }
    },
    commonSubstitutes: [{
      type: Schema.Types.ObjectId,
      ref: 'Ingredient'
    }],
    storageInstructions: String,
    sheflLife: {
      pantry: Number,
      refrigerator: Number,
      freezer: Number
    },
    allergies: [String],
    dietaryRestrictions: [String]
  },
  {
    timestamps: true
  }
);

// Create text index for search
ingredientSchema.index({ name: 'text' });
ingredientSchema.index({ category: 1 });

// Create and export the Ingredient model
export const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema); 