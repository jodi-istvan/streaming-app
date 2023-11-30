import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { userRouter } from './routes/user-route.js';
import { authRouter } from './routes/auth-route.js';
import { videoRouter } from './routes/video-routes.js';

import AuthController from './controllers/auth.controller.js';

export const app: Express = express();

const authController = new AuthController()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/server/public', express.static(`${process.cwd()}/server/public`))

app.use('/api/user', authController.authenticate, userRouter)
app.use('/api/auth', authRouter)
app.use('/api/video', videoRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`Cannot find route ${req.originalUrl}`));
});
