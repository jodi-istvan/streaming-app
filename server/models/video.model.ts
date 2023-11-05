import { Document } from 'mongoose';
import IAudit from './audit.model.js';
import IUserFeedback from './user-feedback.model.js';
import IComment from './comment.model.js';

export default interface IVideo extends Document, IAudit, IUserFeedback {
  title: string;
  duration: number;
  thumbnailPath: string;
  filePath: string;
  views: number;
  videos: Array<IVideo>,
  comments: Array<IComment>,
}
