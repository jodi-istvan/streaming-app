import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import IUser from '../models/user.model.js';

interface IUserMethods {
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
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
  },
  likedVideos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video'
  },
  likedComments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment'
  },
  likedCommentResponses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'CommentResponse'
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcryptjs.hash(this.password, 12)
  next();
})

userSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<IUser>('User', userSchema);
