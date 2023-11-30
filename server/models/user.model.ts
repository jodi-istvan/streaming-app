import { Document } from 'mongoose';
import IVideo from './video.model.js';
import IComment from './comment.model.js';
import ICommentResponse from './comment-response.model.js';

export default interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  subscribers: number;
  likedVideos?: Array<IVideo>;
  likedComments?: Array<IComment>;
  likedCommentResponses?: Array<ICommentResponse>;
  videos?: Array<IVideo>;
  subscriptions?: Array<IUser>;
}
