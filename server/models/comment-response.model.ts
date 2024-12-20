import { Document } from 'mongoose';
import IAudit from './audit.model.js';
import IUserFeedback from './user-feedback.model.js';
import IComment from './comment.model.js';

export default interface ICommentResponse extends Document, IAudit, IUserFeedback {
  body: string;
  comment: IComment;
}
