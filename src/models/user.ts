import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

// Mongoose schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, preventing recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;