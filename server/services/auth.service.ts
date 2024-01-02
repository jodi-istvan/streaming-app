import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../schemas/user.schema.js';

export default class AuthService {
  
  public static get tokenExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN;
  }
  
  public static readonly signJWTToken = (id: string) => {
    return jwt.default.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: AuthService.tokenExpiresIn
    });
  }
  
  public static readonly verifyJWTToken = (token: string) => {
    return jwt.default.verify(token, process.env.JWT_SECRET)
  }
  
  public static readonly generateRandomToken = (): string => {
    return crypto.randomBytes(32).toString('hex')
  }
  
  public static readonly hashRandomToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
  
  public static readonly unsetSignupConfirmToken = (id: string) => {
    return User.findByIdAndUpdate(id, { $unset: { signupConfirmToken: '' } })
  }
  
  public static readonly activateUser = async (token: string) => {
    const hashedToken = AuthService.hashRandomToken(token)
    const user = await User.findOne({ signupConfirmToken: hashedToken });
    if (!user) {
      throw new Error('Invalid token')
    }
    user.active = true
    delete user.signupConfirmToken
    
    return user.save()
  }
}
