import IAudit from './audit.model.js';
import IUserFeedback from './user-feedback.model.js';
import IVideo from './video.model.js';
import ICommentResponse from './comment-response.model.js';

export default interface IComment extends IAudit, IUserFeedback {
  body: string;
  video: IVideo;
  commentResponses?: Array<ICommentResponse>;
}
