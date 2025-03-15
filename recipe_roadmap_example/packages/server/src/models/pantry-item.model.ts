import mongoose, { Document, Schema } from 'mongoose';
import { UnitOfMeasurement } from './ingredient.model';

// Pantry item status
export enum PantryItemStatus {
  AVAILABLE = 'available',
  LOW = 'low',
  USED = 'used',
  EXPIRED = 'expired'
}

// Storage location
export enum StorageLocation {
  PANTRY = 'pantry',
  REFRIGERATOR = 'refrigerator',
  FREEZER = 'freezer',
  CABINET = 'cabinet',
  OTHER = 'other'
}

// Pantry item interface
export interface IPantryItem extends Document {
  user: mongoose.Types.ObjectId;
  ingredient: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  purchaseDate: Date;
  expirationDate?: Date;
  status: PantryItemStatus;
  storageLocation?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pantry item schema
const pantryItemSchema = new Schema<IPantryItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
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
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    expirationDate: {
      type: Date
    },
    status: {
      type: String,
      enum: Object.values(PantryItemStatus),
      default: PantryItemStatus.AVAILABLE
    },
    storageLocation: {
      type: String,
      trim: true
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

// Pre-save middleware to update status based on expiration date
pantryItemSchema.pre('save', function(next) {
  // Update status based on expiration date
  if (this.expirationDate && this.expirationDate < new Date()) {
    this.status = PantryItemStatus.EXPIRED;
  }
  
  // Update status based on quantity
  if (this.quantity === 0) {
    this.status = PantryItemStatus.USED;
  } else if (this.quantity < 0.2) {
    this.status = PantryItemStatus.LOW;
  }
  
  next();
});

// Create indexes
pantryItemSchema.index({ user: 1 });
pantryItemSchema.index({ user: 1, ingredient: 1 }, { unique: true });
pantryItemSchema.index({ expirationDate: 1 });
pantryItemSchema.index({ status: 1 });

// Create PantryItem model
export const PantryItem = mongoose.model<IPantryItem>('PantryItem', pantryItemSchema); 