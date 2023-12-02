import { Request, Response } from 'express';
import { CommentResponse } from '../schemas/comment-response.schema.js';
import { Comment } from '../schemas/comment.schema.js';

export default class CommentResponseController {
  private readonly model = CommentResponse
  private readonly comment = Comment
  
  public readonly getAll = async (req: Request, res: Response) => {
    try {
      const documents = await this.model.find()
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
    if (!(await this.comment.exists({ _id: comment }))) {
      return res.status(400).json({ message: 'Comment provided in body does not exist'})
    }
    
    try {
      const commentResponseDoc = await this.model.create({
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
    delete req.body.comment
    delete req.body.likes
    delete req.body.createdBy
    delete req.body.createdAt
    delete req.body.updatedAt
    
    try {
      const commentResponseDoc = await this.model.findById(id)
      if (!commentResponseDoc) {
        return res.status(404).json({ message: 'CommentResponse does not exist' })
      }
      
      const updatedCommentResponseDoc = await this.model.findByIdAndUpdate(id, req.body, { new: true })
      return res.status(200).json(updatedCommentResponseDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
}
