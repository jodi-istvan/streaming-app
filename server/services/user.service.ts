import BaseService from '../utils/base-service.js';
import { User } from '../schemas/user.schema.js';

export default class UserService extends BaseService {
  protected model = User
  
  public readonly likeVideo = (userId: string, videoId: string) => {
    return this.model.findByIdAndUpdate(userId, { $push: { likedVideos: videoId } })
  }
  
  public readonly unlikeVideo = (userId: string, videoId: string) => {
    return this.model.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } })
  }
}
