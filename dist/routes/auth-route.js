import express from 'express';
import AuthController from '../controllers/auth.controller.js';
const authController = new AuthController();
export const authRouter = express.Router();
authRouter.route('/signup').post(authController.signup);
authRouter.route('/login').post(authController.login);
//# sourceMappingURL=auth-route.js.map