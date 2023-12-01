import { Request, Response } from 'express';
import multer from 'multer'
import shell from 'shelljs'

import { Video } from '../schemas/video.schema.js';
import { User } from '../schemas/user.schema.js';
import IVideo from '../models/video.model.js';

export default class VideoController {
  private readonly model = Video
  private readonly user = User
  private readonly videoUploadFileDest = `${process.cwd()}/server/tmp/videos`
  private readonly videoSegmentsDest = `${process.cwd()}/server/public/video_segments`
  private readonly thumbnailsDest = `${process.cwd()}/server/public/thumbnails`
  
  private _multerFileFilter = (req: Request, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true)
    } else {
      cb(new Error('File type should be video'), false)
    }
  }
  
  private _multerStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, this.videoUploadFileDest)
    },
    filename: (req: Request, file, cb) => {
      const userId = req.user._id
      const timestamp = Date.now().toString()
      const extension = file.mimetype.split('/')[1]
      const fileName = `${userId}-${timestamp}.${extension}`
      cb(null, fileName)
    }
  })
  
  private _multerUpload = multer({
    storage: this._multerStorage,
    fileFilter: this._multerFileFilter
  })
  
  public readonly uploadVideoFile = this._multerUpload.single('video')
  
  public readonly get = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Video id missing from url params' })
    }
    
    const videoDoc = await this.model.findById(id)
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
      const videoFileId = fileName.split('.')[0]
      
      const videoFormatExec = shell.exec(`${process.cwd()}/server/scripts/get_video_format.sh ${this.videoUploadFileDest}/${fileName}`)
      if (videoFormatExec.code !== 0) {
        throw new Error('ffmpeg video conversion failed')
      }
      const videoFormatJSON = JSON.parse(videoFormatExec.stdout).format
      const duration = Math.floor(Number(videoFormatJSON.duration)) // seconds
    
      const generateSegmentsExec = shell.exec(`${process.cwd()}/server/scripts/generate_segments.sh ${this.videoUploadFileDest}/${fileName} ${this.videoSegmentsDest} ${videoFileId}`)
      if (generateSegmentsExec.code !== 0) {
        throw new Error('shaka packager packaging failed')
      }
      const mpdPath = `${this.videoSegmentsDest}/${videoFileId}/manifest.mpd`
  
      const thumbnailPath = `${this.thumbnailsDest}/${videoFileId}.jpg`
      const generateSSExec = shell.exec(`${process.cwd()}/server/scripts/generate_screenshot.sh ${this.videoUploadFileDest}/${fileName} ${thumbnailPath}`)
      if (generateSSExec.code !== 0) {
        throw new Error('ffmpeg screenshot failed')
      }
      
      this.removeTmpVideo(fileName)
      
      const videoDoc = await this.model.create({
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
      const videoDoc = await this.model.findById(id)
      if (!videoDoc) {
        return res.status(404).json({ message: 'Video not found' })
      }
      
      this.removeSegments(this.getVideoFileId(videoDoc))
      this.removeThumbnail(`${this.getVideoFileId(videoDoc)}.jpg`)
      
      await this.model.findByIdAndDelete(id);
      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  
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
      const videoDoc = await this.model.findById(id)
      if (!videoDoc) {
        return res.status(404).json({ message: 'Video not found' })
      }
      
      const userLikedVideo = user.likedVideos.includes(videoDoc._id)
      if (action === 'ADD') {
        if (userLikedVideo) {
          return res.status(304).json({ message: 'User already liked this video' })
        }
        videoDoc.likes++
      } else {
        if (!userLikedVideo) {
          return res.status(304).json({ message: 'User has not liked this video yet' })
        }
        videoDoc.likes--
      }
      const updatedVideoDoc = await videoDoc.save()
      const queryAction = action === 'ADD' ? '$push' : '$pull'
      await this.user.findByIdAndUpdate(user._id, { [queryAction]: { likedVideos: videoDoc._id } })
  
      return res.status(200).json(updatedVideoDoc);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  
  private readonly getVideoFileId = (videoDoc: IVideo) => {
    const pathArray = videoDoc.mpdPath.split('/')
    return pathArray[pathArray.length - 2]
  }
  
  private readonly removeTmpVideo = (videoFileName: string): void => {
    if (!videoFileName) {
      return
    }
    const path = `${this.videoUploadFileDest}/${videoFileName}`
    const rmExec = shell.exec(`rm ${path}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
  
  private readonly removeThumbnail = (thumbnailFileName: string): void => {
    if (!thumbnailFileName) {
      return
    }
    const path = `${this.thumbnailsDest}/${thumbnailFileName}`
    const rmExec = shell.exec(`rm ${path}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
  
  private readonly removeSegments = (segmentsDirName: string): void => {
    if (!segmentsDirName) {
      return
    }
    const path = `${this.videoSegmentsDest}/${segmentsDirName}`
    const rmExec = shell.exec(`rm -r ${path}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
}
