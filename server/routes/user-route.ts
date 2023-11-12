import express from 'express';
import UserController from '../controllers/user.controller.js';

const userController = new UserController();

export const userRouter = express.Router()

userRouter.route('/:id').get(userController.get)
