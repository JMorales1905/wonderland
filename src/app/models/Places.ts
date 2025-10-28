// ==========================================
// 1. Place Model (models/Place.ts)
// ==========================================
import mongoose, { Schema, Model, models } from 'mongoose';

export interface IPlace {
  _id: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  location?: string;
  significance?: string;
  atmosphere?: string;
  history?: string;
  inhabitants?: string;
  features?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Place type is required'],
      trim: true,
      maxlength: [50, 'Type cannot be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Place description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [500, 'Location cannot be more than 500 characters'],
    },
    significance: {
      type: String,
      trim: true,
      maxlength: [1000, 'Significance cannot be more than 1000 characters'],
    },
    atmosphere: {
      type: String,
      trim: true,
      maxlength: [1000, 'Atmosphere cannot be more than 1000 characters'],
    },
    history: {
      type: String,
      trim: true,
      maxlength: [2000, 'History cannot be more than 2000 characters'],
    },
    inhabitants: {
      type: String,
      trim: true,
      maxlength: [1000, 'Inhabitants cannot be more than 1000 characters'],
    },
    features: {
      type: String,
      trim: true,
      maxlength: [1000, 'Features cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

PlaceSchema.index({ userId: 1, name: 1 });
PlaceSchema.index({ userId: 1, createdAt: -1 });

const Place: Model<IPlace> = 
  models.Place || mongoose.model<IPlace>('Place', PlaceSchema);

export default Place;
