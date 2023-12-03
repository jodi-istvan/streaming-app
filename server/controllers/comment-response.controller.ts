import { Request, Response } from 'express';
import CommentResponseService from '../services/comment-response.service.js';
import CommentService from '../services/comment.service.js';

export default class CommentResponseController {
  private readonly commentResponseService = new CommentResponseService()
  private readonly commentService = new CommentService()
  
  public readonly getAll = async (req: Request, res: Response) => {
    try {
      const documents = await this.commentResponseService.find()
      return res.status(200).json(documents);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
  
  public readonly create = async (req: Request, res: Response) => {
    const { body, comment } = req.body
    const { user } = req
    if (!body || !comment) {
      return res.status(400).json({ message: 'Missing body or video from request body'})
    }
    if (!(await this.commentService.exists(comment))) {
      return res.status(400).json({ message: 'Comment provided in body does not exist'})
    }
    
    try {
      const commentResponseDoc = await this.commentResponseService.create({
        body,
        comment,
        createdBy: user._id
      })
      return res.status(201).json(commentResponseDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
  
  public readonly patch = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'CommentResponse id missing from url params' })
    }
    
    try {
      const commentResponseDoc = await this.commentResponseService.findById(id)
      if (!commentResponseDoc) {
        return res.status(404).json({ message: 'CommentResponse does not exist' })
      }
      commentResponseDoc.body = req.body.body
      const updatedCommentResponseDoc = await commentResponseDoc.save()
      return res.status(200).json(updatedCommentResponseDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
}
