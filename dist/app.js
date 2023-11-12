import express from 'express';
import morgan from 'morgan';
import { userRouter } from './routes/user-route.js';
import { authRouter } from './routes/auth-route.js';
export const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.all('*', (req, res, next) => {
    next(new Error(`Cannot find route ${req.originalUrl}`));
});
//# sourceMappingURL=app.js.map