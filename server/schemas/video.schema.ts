import mongoose from 'mongoose';
import IVideo from '../models/video.model.js';

const videoSchema = new mongoose.Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  thumbnailPath: {
    type: String,
    required: true,
    trim: true,
  },
  mpdPath: {
    type: String,
    required: true,
    trim: true,
  },
  views: {
    type: Number,
    required: true,
    default: 0
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
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export const Video = mongoose.model<IVideo>('Video', videoSchema)
