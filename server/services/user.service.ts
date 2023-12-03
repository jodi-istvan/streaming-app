import BaseService from '../utils/base-service.js';
import { User } from '../schemas/user.schema.js';

export default class UserService extends BaseService {
  protected model = User
  
  public create = (doc) => {
    return this.model.create(doc)
  }
  
  public readonly findByEmail = (email: string) => {
    return this.model.findOne({ email }).select('+password');
  }
  
  public readonly likeVideo = (userId: string, videoId: string) => {
    return this.model.findByIdAndUpdate(userId, { $push: { likedVideos: videoId } })
  }
  
  public readonly unlikeVideo = (userId: string, videoId: string) => {
    return this.model.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } })
  }
}
