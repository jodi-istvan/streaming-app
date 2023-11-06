import mongoose from 'mongoose';
import IComment from '../models/comment.model.js';

const commentSchema = new mongoose.Schema<IComment>({
  body: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
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
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
