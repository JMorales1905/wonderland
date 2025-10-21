// ==========================================
// 2. Character Model (models/Character.ts)
// ==========================================
import mongoose, { Schema, Model, models } from 'mongoose';

export interface ICharacter {
  _id: string;
  userId: string; // To associate characters with specific users
  name: string;
  age?: number;
  role: string;
  description: string;
  background?: string;
  personality?: string;
  appearance?: string;
  relationships?: string;
  motivations?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries
    },
    name: {
      type: String,
      required: [true, 'Character name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [10000, 'Age must be reasonable'],
    },
    role: {
      type: String,
      required: [true, 'Character role is required'],
      trim: true,
      maxlength: [50, 'Role cannot be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Character description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    background: {
      type: String,
      trim: true,
      maxlength: [2000, 'Background cannot be more than 2000 characters'],
    },
    personality: {
      type: String,
      trim: true,
      maxlength: [1000, 'Personality cannot be more than 1000 characters'],
    },
    appearance: {
      type: String,
      trim: true,
      maxlength: [500, 'Appearance cannot be more than 500 characters'],
    },
    relationships: {
      type: String,
      trim: true,
      maxlength: [1000, 'Relationships cannot be more than 1000 characters'],
    },
    motivations: {
      type: String,
      trim: true,
      maxlength: [1000, 'Motivations cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better search performance
CharacterSchema.index({ userId: 1, name: 1 });
CharacterSchema.index({ userId: 1, createdAt: -1 });

const Character: Model<ICharacter> = 
  models.Character || mongoose.model<ICharacter>('Character', CharacterSchema);

export default Character;