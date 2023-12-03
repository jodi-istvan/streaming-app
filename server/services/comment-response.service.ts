import BaseService from '../utils/base-service.js';
import { CommentResponse } from '../schemas/comment-response.schema.js';

export default class CommentResponseService extends BaseService {
  protected model = CommentResponse
}
