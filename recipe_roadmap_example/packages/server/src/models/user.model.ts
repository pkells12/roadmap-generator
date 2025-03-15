import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the dietary preference options
export enum DietaryPreference {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  PESCATARIAN = 'pescatarian',
  KETO = 'keto',
  PALEO = 'paleo',
  GLUTEN_FREE = 'gluten-free',
  DAIRY_FREE = 'dairy-free',
  LOW_CARB = 'low-carb',
  LOW_FAT = 'low-fat',
  NONE = 'none'
}

// User roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// User preferences interface
export interface IUserPreferences {
  dietaryPreferences: DietaryPreference[];
  allergens: string[];
  dislikedIngredients: string[];
  cookingTime: {
    max: number; // Maximum cooking time in minutes
  };
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  servingSize: number; // Default number of servings
}

// User document interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  preferences: IUserPreferences;
  isEmailVerified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    preferences: {
      dietaryPreferences: {
        type: [String],
        enum: Object.values(DietaryPreference),
        default: [DietaryPreference.NONE]
      },
      allergens: {
        type: [String],
        default: []
      },
      dislikedIngredients: {
        type: [String],
        default: []
      },
      cookingTime: {
        max: {
          type: Number,
          default: 60
        }
      },
      skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      },
      servingSize: {
        type: Number,
        default: 2,
        min: 1,
        max: 12
      }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

// Hash the password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
export const User = mongoose.model<IUser>('User', userSchema); 