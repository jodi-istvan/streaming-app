import { Request, Response } from 'express';
import * as fs from 'fs'
import multer from 'multer'

import { Video } from '../schemas/video.schema.js';
import IVideo from '../models/video.model.js';

export default class VideoController {
  private readonly model = Video
  private readonly videoFileDest = `${process.cwd()}/server/media/videos/`
  
  private _multerFileFilter = (req: Request, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true)
    } else {
      cb(new Error('File type should be video'), false)
    }
  }
  
  private _multerStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, this.videoFileDest)
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
  
  public readonly stream = async (req: Request, res: Response) => {
    const videoId = req.query.id
    const videoDoc: IVideo = await this.model.findById(videoId)
    
    if(!videoDoc) {
      return res.status(404).json({ message: 'Video not found' })
    }
    
    try {
      const filePath = `${process.cwd()}/server/media/videos/${videoDoc.fileName}`
      const videoStats = fs.statSync(filePath)
      const fileSize = videoStats.size
      
      const { range } = req.headers
      if (range) {
        const part = range.split('bytes=')[1].split(', ')[0].split('-')
        const start = parseInt(part[0], 10)
        const end = part[1] ? parseInt(part[1], 10) : fileSize - 1
        const chunkSize = end - start + 1
  
        const file = fs.createReadStream(filePath, { start, end })
  
        const header = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4'
        }
        res.writeHead(206, header)
        file.pipe(res)
      } else {
        const header = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        }
        res.writeHead(200, header)
        fs.createReadStream(filePath).pipe(res)
      }
    } catch (err) {
      console.error(err);
      return res.sendStatus(500)
    }
  }
  
  public readonly uploadVideoFile = this._multerUpload.single('video')
  
  public readonly create = async (req: Request, res: Response) => {
    const { title, description, duration, thumbnailPath } = req.body
    const userId = req.user._id
    const fileName = req.file.filename
    
    try {
      const videoDoc = await this.model.create({
        title,
        description,
        duration: 0, // Find out duration of video
        thumbnailPath: 'asd', // Extract random frame from video
        fileName,
        createdBy: userId
      })
      return res.status(200).json({ video: videoDoc })
    } catch (err) {
      console.error(err)
      return res.sendStatus(500)
    }
  }
}
