import mongoose, { Document, Schema } from 'mongoose';
import { UnitOfMeasurement } from './ingredient.model';
import { DietaryPreference } from './user.model';

// Cuisine types
export enum Cuisine {
  AMERICAN = 'american',
  ITALIAN = 'italian',
  CHINESE = 'chinese',
  JAPANESE = 'japanese',
  KOREAN = 'korean',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  MEDITERRANEAN = 'mediterranean',
  FRENCH = 'french',
  SPANISH = 'spanish',
  GREEK = 'greek',
  THAI = 'thai',
  VIETNAMESE = 'vietnamese',
  MIDDLE_EASTERN = 'middle_eastern',
  AFRICAN = 'african',
  CARIBBEAN = 'caribbean',
  FUSION = 'fusion',
  OTHER = 'other'
}

// Meal types
export enum MealType {
  BREAKFAST = 'breakfast',
  BRUNCH = 'brunch',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  APPETIZER = 'appetizer',
  SIDE_DISH = 'side_dish',
  DRINK = 'drink',
  OTHER = 'other'
}

// Recipe difficulty levels
export enum RecipeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Recipe ingredient interface
interface IRecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  isOptional?: boolean;
}

// Recipe instruction interface
interface IRecipeInstruction {
  step: number;
  text: string;
}

// Recipe review interface
export interface IRecipeReview {
  user: string; // Reference to User model
  rating: number; // 1-5
  comment?: string;
  date: Date;
}

// Recipe nutritional info interface
export interface IRecipeNutritionalInfo {
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

// Recipe document interface
export interface IRecipe extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  ingredients: IRecipeIngredient[];
  instructions: IRecipeInstruction[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: RecipeDifficulty;
  tags: string[];
  cuisine: string;
  isFavorite: boolean;
  image?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Recipe ingredient schema
const recipeIngredientSchema = new Schema<IRecipeIngredient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  isOptional: {
    type: Boolean,
    default: false
  }
});

// Recipe instruction schema
const recipeInstructionSchema = new Schema<IRecipeInstruction>({
  step: {
    type: Number,
    required: true,
    min: 1
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
});

// Recipe schema
const recipeSchema = new Schema<IRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    ingredients: {
      type: [recipeIngredientSchema],
      required: true,
      validate: {
        validator: function(ingredients: IRecipeIngredient[]) {
          return ingredients.length > 0;
        },
        message: 'Recipe must have at least one ingredient'
      }
    },
    instructions: {
      type: [recipeInstructionSchema],
      required: true,
      validate: {
        validator: function(instructions: IRecipeInstruction[]) {
          return instructions.length > 0;
        },
        message: 'Recipe must have at least one instruction'
      }
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0
    },
    cookTime: {
      type: Number,
      required: true,
      min: 0
    },
    totalTime: {
      type: Number,
      required: true,
      min: 0
    },
    servings: {
      type: Number,
      required: true,
      min: 1
    },
    difficulty: {
      type: String,
      enum: Object.values(RecipeDifficulty),
      default: RecipeDifficulty.MEDIUM
    },
    tags: {
      type: [String],
      default: []
    },
    cuisine: {
      type: String,
      trim: true,
      default: 'Other'
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    image: {
      type: String
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ userId: 1 });
recipeSchema.index({ userId: 1, isFavorite: 1 });
recipeSchema.index({ userId: 1, cuisine: 1 });
recipeSchema.index({ userId: 1, 'ingredients.name': 1 });

// Create Recipe model
const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe; 