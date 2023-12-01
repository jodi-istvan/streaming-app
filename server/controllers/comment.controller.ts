import { Request, Response } from 'express';
import { Comment } from '../schemas/comment.schema.js';
import { Video } from '../schemas/video.schema.js';

export default class CommentController {
  private readonly model = Comment
  private readonly video = Video
  
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
    const { body, video } = req.body
    const { user } = req
    if (!body || !video) {
      return res.status(400).json({ message: 'Missing body and video from request body'})
    }
    if (!(await this.video.exists({ _id: video }))) {
      return res.status(400).json({ message: 'Video provided in body does not exist'})
    }
    
    try {
      const commentDoc = await this.model.create({
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
  
  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Comment id missing from url params' })
    }
    delete req.body.video
    delete req.body.likes
    delete req.body.createdBy
    delete req.body.createdAt
    delete req.body.updatedAt

    try {
      const commentDoc = await this.model.findById(id)
      if (!commentDoc) {
        return res.status(404).json({ message: 'Comment does not exist' })
      }
      
      const updatedCommentDoc = await this.model.findByIdAndUpdate(id, req.body, { new: true })
      return res.status(200).json(updatedCommentDoc)
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
}
