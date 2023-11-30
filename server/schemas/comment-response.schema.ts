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
  likes: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
})

export const CommentResponse = mongoose.model<ICommentResponse>('CommentResponse', commentResponseSchema);
