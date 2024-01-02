import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service.js';
import AuthService from '../services/auth.service.js';
import Mailer from '../utils/mailer.js';
import moment from 'moment';

export default class AuthController {
  private readonly userService = new UserService()
  
  public readonly signup = async (req: Request, res: Response) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Body must contain name, password and email' });
    }
    
    try {
      const token = AuthService.generateRandomToken();
      const signupConfirmToken = AuthService.hashRandomToken(token)
      await this.userService.create({ name, password, email, signupConfirmToken });
      
      const resetURL = `${req.protocol}://${req.get('host')}/api/auth/confirm-signup/${token}`
      const from = 'Iodi Istvan <streaming-app@admin.com>'
      const to = email
      const subject = 'Streaming app - confirm signup'
      const html = `<p>Confirm your email address by clicking <a href="${resetURL}">here</a>.</p>>`
      
      await Mailer.sendMail({ from, to, subject, html })
      return res.sendStatus(201);
    } catch (err) {
      console.error(err)
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Account with given email address already exists' });
      }
      
      return res.status(500).json({ message: 'Something went wrong while sending email' })
    }
  }
  
  public readonly confirmSignup = async (req: Request, res: Response) => {
    const { token } = req.params
    if (!token) {
      return res.status(400).json({ message: 'Missing token from url params' })
    }

    try {
      await AuthService.activateUser(token)
      res.writeHead(301, { Location: 'http://localhost:4200' })
      
      return res.end()
    } catch (err) {
     console.error(err)
     return res.status(400).json({ message: err.message })
    }
  }
  
  public readonly login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Body must contain email and password' })
    }
    
    let user = await this.userService.findByEmail(email)
    if (!user) {
      return res.status(404).json({ message: 'Account with given email address not found' })
    }
    if (!user.active) {
      return res.status(403).json({ message: 'User is inactive' })
    }
  
    //@ts-ignore
    if (!(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' })
    }
    
    const token = AuthService.signJWTToken(user._id);
    user = user.toObject();
    delete user.password;
    delete user.active;
    return res.status(200).json({
      token,
      expiresAt: moment().add(AuthService.tokenExpiresIn.substring(0, AuthService.tokenExpiresIn.length - 1), 'd'),
      user,
    });
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
      const userId = AuthService.verifyJWTToken(token).id
      const user = await this.userService.findById(userId)
  
      if (!user) {
        return res.status(403).json({ message: 'User does not exist' })
      }
      if (!user.active) {
        return res.status(403).json({ message: 'User is inactive' })
      }
      
      req.user = user;
      return next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid bearer token' })
    }
  }
}
