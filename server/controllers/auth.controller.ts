import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service.js';
import AuthService from '../services/auth.service.js';

export default class AuthController {
  private readonly userService = new UserService()
  
  public readonly signup = async (req: Request, res: Response) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Body must contain name, password and email' });
    }
    try {
      const newUser = (await this.userService.create({ name, password, email })).toObject();
      const token = AuthService.signToken(newUser._id)
      delete newUser.password
  
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
    
    const user = await this.userService.findByEmail(email)
    if (!user) {
      return res.status(404).json({ message: 'Account with given email address not found' })
    }
  
    //@ts-ignore
    if (!(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' })
    }
    
    const token = AuthService.signToken(user._id);
    return res.status(200).json(token);
  }
  
  public readonly authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) {
      return res.status(400).json({ message: 'Missing authorization from request headers' })
    }
    
    const token = authorization.split(' ')[1]
    if (!token || !authorization.startsWith('Bearer')) {
      return res.status(403).json({ message: 'Invalid bearer token format' })
    }
    
    try {
      const userId = AuthService.verifyToken(token).id
      const user = await this.userService.findById(userId)
      if (!user) {
        return res.status(403).json({ message: 'User does not exist' })
      }
      
      req.user = user;
      return next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid bearer token' })
    }
  }
}
