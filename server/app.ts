import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import { userRouter } from './routes/user-route.js';

export const app: Express = express();

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/user', userRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`Cannot find route ${req.originalUrl}`));
});
