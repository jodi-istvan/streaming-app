import { Request, Response } from 'express';
import { User } from '../schemas/user.schema.js';
import StorageService from '../services/storage.service.js';

export default class UserController {
  private readonly model = User
  private readonly storageService = new StorageService()
  
  public readonly get = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const document = await this.model.findById(id);
      return res.status(200).json(document);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
  
  public readonly uploadProfilePicture = this.storageService.multerProfilePictureUpload.single('profilePicture');
  
  public readonly updateProfilePicture = async (req: Request, res: Response) => {
    const { user } = req;
    const fileName = req.file.filename;
    const profilePictureUrl = `${process.env.DEV_HOST}:${process.env.DEV_PORT}/${process.env.PROFILE_PICTURE_UPLOAD_DESTINATION}/${fileName}`;
    try {
      await this.model.findByIdAndUpdate(user._id, { profilePictureUrl });
      
      return res.status(203).json();
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
