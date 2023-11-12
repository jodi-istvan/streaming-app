import { Request, Response } from 'express';
import { User } from '../schemas/user.schema.js';

export default class UserController {
  private readonly model = User
  
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
}
