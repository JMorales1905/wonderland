// ==========================================
// 1. Plot Model (models/Plot.ts)
// ==========================================
import mongoose, { Schema, Model, models } from 'mongoose';

export interface IPlot {
  _id: string;
  userId: string;
  title: string;
  chapter?: string;
  type: string;
  description: string;
  timeframe?: string;
  location?: string;
  characters?: string;
  significance?: string;
  conflicts?: string;
  resolution?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlotSchema = new Schema<IPlot>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Plot title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    chapter: {
      type: String,
      trim: true,
      maxlength: [50, 'Chapter cannot be more than 50 characters'],
    },
    type: {
      type: String,
      required: [true, 'Plot type is required'],
      trim: true,
      maxlength: [50, 'Type cannot be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Plot description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    timeframe: {
      type: String,
      trim: true,
      maxlength: [200, 'Timeframe cannot be more than 200 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [500, 'Location cannot be more than 500 characters'],
    },
    characters: {
      type: String,
      trim: true,
      maxlength: [1000, 'Characters cannot be more than 1000 characters'],
    },
    significance: {
      type: String,
      trim: true,
      maxlength: [1000, 'Significance cannot be more than 1000 characters'],
    },
    conflicts: {
      type: String,
      trim: true,
      maxlength: [1000, 'Conflicts cannot be more than 1000 characters'],
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution cannot be more than 1000 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot be more than 2000 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

PlotSchema.index({ userId: 1, title: 1 });
PlotSchema.index({ userId: 1, createdAt: -1 });

if (models.Plot) {
  delete models.Plot;
}
const Plot: Model<IPlot> = mongoose.model<IPlot>('Plot', PlotSchema);

export default Plot;
