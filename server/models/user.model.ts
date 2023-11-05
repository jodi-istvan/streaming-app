import { Document } from 'mongoose';
import IVideo from './video.model.js';

export default interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  subscribers: number;
  
  // Virtual fields
  videos?: Array<IVideo>;
  subscriptions?: Array<IUser>;
}
