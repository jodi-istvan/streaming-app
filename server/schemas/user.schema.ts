import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
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
    select: false,
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
    min: 0,
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcryptjs.hash(this.password, 12)
  next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<IUser>('User', userSchema);
