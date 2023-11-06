import mongoose from 'mongoose';
import ICommentResponse from '../models/comment-response.model.js';

const commentResponseSchema = new mongoose.Schema<ICommentResponse>({
  body: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  dislikes: {
    type: Number,
    required: true,
    default: 0
  }
})

export const CommentResponse = mongoose.model<ICommentResponse>('CommentResponse', commentResponseSchema);
