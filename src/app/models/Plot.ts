//
// 1. Plot Model (models/Place.ts) 
//

import mongoose, { Schema, Model, models } from "mongoose";

export interface IPlot {
    _id: string;
    userId: string;
    description: string;
    beginning?: string;
    middle?: string;
    end?: string;
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

        description: {
            type: String,
            required: [true, 'Plot description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters']
        },

        beginning: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters']
        },

        middle: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters']
        },

        end: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters']
        },
    },
    {
        timestamps: true,
    },
);

PlotSchema.index({ userId: 1, name: 1 });
PlotSchema.index({ userId: 1, createdAt: -1 });

const Plot: Model<IPlot> = models.Plot || mongoose.model<IPlot>('Plot', PlotSchema);

export default Plot;