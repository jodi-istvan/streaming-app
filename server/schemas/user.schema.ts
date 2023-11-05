import * as mongoose from 'mongoose';
import IUser from '../models/user.model.js';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  subscribers: {
    type: Number,
    required: true,
  },
})

export const User = mongoose.model<IUser>('User', userSchema);
