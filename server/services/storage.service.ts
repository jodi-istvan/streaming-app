import { Request } from 'express';
import multer from 'multer'
import shell from 'shelljs'

export interface VideoFormat {
  duration: number;
}

export default class StorageService {
  get multerVideoUpload() {
    return multer({
      storage: this._multerVideoStorage,
      fileFilter: this._multerVideoFilter
    })
  }
  
  public static readonly getVideoFormat = (fileName: string): VideoFormat => {
    const videoFormatExec = shell.exec(`${process.cwd()}/server/scripts/get_video_format.sh ${process.env.VIDEO_UPLOAD_DEST}/${fileName}`)
    if (videoFormatExec.code !== 0) {
      throw new Error('ffprobe format check failed')
    }
    return JSON.parse(videoFormatExec.stdout).format
  }
  
  public static readonly generateSegments = (fileName: string): string => {
    const videoFileId = fileName.split('.')[0]
    const generateSegmentsExec = shell.exec(`${process.cwd()}/server/scripts/generate_segments.sh ${process.env.VIDEO_UPLOAD_DEST}/${fileName} ${process.env.VIDEO_SEGMENT_DEST} ${videoFileId}`)
    if (generateSegmentsExec.code !== 0) {
      throw new Error('shaka packager packaging failed')
    }
    const mpdPath = `${process.env.VIDEO_SEGMENT_DEST}/${videoFileId}/manifest.mpd`
    return mpdPath
  }
  
  public static readonly generateScreenshot = (fileName: string): string => {
    const videoFileId = fileName.split('.')[0]
    const thumbnailPath = `${process.env.THUMBNAIL_DEST}/${videoFileId}.jpg`
    const generateSSExec = shell.exec(`${process.cwd()}/server/scripts/generate_screenshot.sh ${process.env.VIDEO_UPLOAD_DEST}/${fileName} ${thumbnailPath}`)
    if (generateSSExec.code !== 0) {
      throw new Error('ffmpeg screenshot failed')
    }
    return thumbnailPath
  }
  
  public readonly removeTmpVideo = (videoFileName: string): void => {
    if (!videoFileName) {
      return
    }
    const path = `${process.env.VIDEO_UPLOAD_DEST}/${videoFileName}`
    const rmExec = shell.exec(`rm ${path}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
  
  public readonly removeSegments = (mpdPath: string): void => {
    if (!mpdPath) {
      return
    }
    const pathArray = mpdPath.split('manifest.mpd')
    const rmExec = shell.exec(`rm -r ${pathArray[0]}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
  
  public readonly removeThumbnail = (thumbnailFilePath: string): void => {
    if (!thumbnailFilePath) {
      return
    }
    const rmExec = shell.exec(`rm ${thumbnailFilePath}`)
    if (rmExec.code !== 0) {
      throw new Error(rmExec.stderr)
    }
  }
  
  private _multerVideoFilter = (req: Request, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true)
    } else {
      cb(new Error('File type should be video'), false)
    }
  }
  
  private _multerVideoStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, process.env.VIDEO_UPLOAD_DEST)
    },
    filename: (req: Request, file, cb) => {
      const userId = req.user._id
      const timestamp = Date.now().toString()
      const extension = file.mimetype.split('/')[1]
      const fileName = `${userId}-${timestamp}.${extension}`
      cb(null, fileName)
    }
  })
}
