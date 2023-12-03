import { Request, Response } from 'express';

import StorageService from '../services/storage.service.js';
import VideoService from '../services/video.service.js';
import UserService from '../services/user.service.js';

export default class VideoController {
  private readonly videoService = new VideoService()
  private readonly userService = new UserService()
  private readonly storageService = new StorageService()
  
  public readonly get = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Video id missing from url params' })
    }
    
    const videoDoc = await this.videoService.findById(id)
    if (!videoDoc) {
      return res.status(404).json({ message: 'Video not found' })
    }
    return res.status(200).json(videoDoc)
  }
  
  public readonly create = async (req: Request, res: Response) => {
    const { title, description } = req.body
    const fileName = req.file.filename
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description missing from request body' })
    }
    
    try {
      const createdBy = req.user._id
      const videoFormat = StorageService.getVideoFormat(fileName)
      const duration = Math.floor(Number(videoFormat.duration)) // seconds
      const mpdPath = StorageService.generateSegments(fileName)
      const thumbnailPath = StorageService.generateScreenshot(fileName)
      this.storageService.removeTmpVideo(fileName)
      
      const videoDoc = await this.videoService.create({
        title,
        description,
        duration,
        thumbnailPath,
        mpdPath,
        createdBy
      })
      return res.status(201).json(videoDoc);
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  
  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Video id missing from url params' })
    }
    
    try {
      const videoDoc = await this.videoService.findById(id)
      if (!videoDoc) {
        return res.status(404).json({ message: 'Video not found' })
      }
      
      this.storageService.removeSegments(videoDoc.mpdPath)
      this.storageService.removeThumbnail(videoDoc.thumbnailPath)
      
      await this.videoService.findByIdAndDelete(id);
      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  
  public readonly uploadVideoFile = this.storageService.multerVideoUpload.single('video')
  
  public readonly patchLikeVideo = async (req: Request, res: Response) => {
    const { id } = req.params
    const action: 'ADD' | 'REMOVE' = req.body.action
    const { user } = req
    if (!id) {
      return res.status(400).json({ message: 'Video id missing from url params' })
    }
    if (!action) {
      return res.status(400).json({ message: 'Action missing from request body' })
    }
    if (action !== 'ADD' && action !== 'REMOVE') {
      return res.status(400).json({ message: 'Action can be either "ADD" or "REMOVE"' })
    }
    
    try {
      const videoDoc = await this.videoService.findById(id)
      if (!videoDoc) {
        return res.status(404).json({ message: 'Video not found' })
      }
      
      const userLikedVideo = user.likedVideos.includes(videoDoc._id)
      if (action === 'ADD') {
        if (userLikedVideo) {
          return res.status(400).json({ message: 'User already liked this video' })
        }
        await this.userService.likeVideo(user._id, videoDoc._id)
        videoDoc.likes++
      } else {
        if (!userLikedVideo) {
          return res.status(400).json({ message: 'User has not liked this video yet' })
        }
        await this.userService.unlikeVideo(user._id, videoDoc._id)
        videoDoc.likes--
      }
      const updatedVideoDoc = await videoDoc.save()
  
      return res.status(200).json(updatedVideoDoc);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
