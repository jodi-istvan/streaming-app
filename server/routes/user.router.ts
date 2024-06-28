import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthController from '../controllers/auth.controller.js';

const userController = new UserController();
const authController = new AuthController()

export const userRouter = express.Router()

userRouter.get('/:id', userController.get);
userRouter.put('/profile-picture', authController.authenticate, userController.uploadProfilePicture, userController.updateProfilePicture)
