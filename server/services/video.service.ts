import { Video } from '../schemas/video.schema.js';
import BaseService from '../utils/base-service.js';

export default class VideoService extends BaseService {
  protected model = Video
  
  public readonly create = (video) => {
    delete video.views
    delete video.likes
    delete video.createdAt
    delete video.updatedAt
    return this.model.create(video)
  }
}
