import { Document } from 'mongoose';
import IAudit from './audit.model.js';
import IUserFeedback from './user-feedback.model.js';
import IComment from './comment.model.js';

export default interface IVideo extends Document, IAudit, IUserFeedback {
  title: string;
  description: string;
  duration: number;
  thumbnailPath: string;
  fileName: string;
  views: number;
  comments: Array<IComment>,
}
