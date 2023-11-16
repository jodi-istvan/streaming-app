import IUser from '../../models/user.model.js';

export {}

declare global {
  namespace Express {
    export interface Request {
      user: IUser,
      file?: {
        fieldname: string;
        originalname: string;
        endcoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
      }
    }
  }
}
