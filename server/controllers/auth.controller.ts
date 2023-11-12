import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../schemas/user.schema.js';

export default class AuthController {
  private readonly model = User
  
  private readonly signToken = (id: string) => {
    return jwt.default.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }
  
  public readonly signup = async (req: Request, res: Response) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Body must contain name, password and email' });
    }
    try {
      const newUser = await this.model.create({ name, password, email });
      const token = this.signToken(newUser._id)
      
      return res.status(201).json({
        user: newUser,
        token
      });
    } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Account with given email address already exists' });
      }
      return res.sendStatus(500);
    }
  }
  
  public readonly login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Body must contain email and password' })
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Account with given email address not found' })
    }
  
    // const passwordMatch = await user.correctPassword(password, user.password);
    // if (!user || !passwordMatch) {
    //   return res.status(401).json({ message: 'Incorrect email or password' })
    // }
    
    const token = this.signToken(user._id);
    return res.status(200).json({ token });
  }
}
