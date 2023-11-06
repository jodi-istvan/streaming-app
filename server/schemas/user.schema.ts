import mongoose from 'mongoose';
import validator from 'validator';
import IUser from '../models/user.model.js';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: validator.isEmail,
  },
  subscribers: {
    type: Number,
    default: 0,
  },
})

export const User = mongoose.model<IUser>('User', userSchema);
