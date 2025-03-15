import mongoose, { Document, Schema } from 'mongoose';
import { UnitOfMeasurement } from './ingredient.model';

// Shopping item status
export enum ShoppingItemStatus {
  NEEDED = 'needed',
  PURCHASED = 'purchased'
}

// Shopping item interface
export interface IShoppingItem {
  ingredient: string; // Reference to Ingredient model
  quantity: number;
  unit: UnitOfMeasurement;
  status: ShoppingItemStatus;
  notes?: string;
  recipe?: string; // Optional reference to Recipe model if item is from a recipe
}

// Shopping list item interface
interface IShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  addedAt: Date;
}

// Shopping list document interface
export interface IShoppingList extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  items: IShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Shopping list item schema
const shoppingListItemSchema = new Schema<IShoppingListItem>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  unit: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: 'Other',
    trim: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Shopping list schema
const shoppingListSchema = new Schema<IShoppingList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      default: 'Shopping List',
      trim: true
    },
    items: {
      type: [shoppingListItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Create indexes
shoppingListSchema.index({ userId: 1 });

// Create ShoppingList model
const ShoppingList = mongoose.model<IShoppingList>('ShoppingList', shoppingListSchema);

export default ShoppingList; 