import * as jwt from 'jsonwebtoken';

export default class AuthService {
  public static readonly signToken = (id: string) => {
    return jwt.default.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }
  
  public static readonly verifyToken = (token: string) => {
    return jwt.default.verify(token, process.env.JWT_SECRET)
  }
}
