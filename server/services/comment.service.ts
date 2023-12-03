import BaseService from '../utils/base-service.js';
import { Comment } from '../schemas/comment.schema.js';

export default class CommentService extends BaseService {
  protected model = Comment
}
