import { Request, Response } from 'express';
import CommentService from '../services/comment.service.js';
import VideoService from '../services/video.service.js';

export default class CommentController {
  private readonly commentService = new CommentService()
  private readonly videoService = new VideoService()
  
  public readonly getAll = async (req: Request, res: Response) => {
    try {
      const documents = await this.commentService.find()
      return res.status(200).json(documents);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
  
  public readonly create = async (req: Request, res: Response) => {
    const { body, video } = req.body
    const { user } = req
    if (!body || !video) {
      return res.status(400).json({ message: 'Missing body or video from request body'})
    }
    if (!(await this.videoService.exists(video))) {
      return res.status(400).json({ message: 'Video provided in body does not exist'})
    }
    
    try {
      const commentDoc = await this.commentService.create({
        body,
        video,
        createdBy: user._id
      })
      return res.status(201).json(commentDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
  
  public readonly patch = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Comment id missing from url params' })
    }

    try {
      const commentDoc = await this.commentService.findById(id)
      if (!commentDoc) {
        return res.status(404).json({ message: 'Comment does not exist' })
      }
      
      commentDoc.body = req.body.body
      const updatedCommentDoc = await commentDoc.save()
      return res.status(200).json(updatedCommentDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
}
