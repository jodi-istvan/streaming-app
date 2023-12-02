import express from 'express';
import CommentController from '../controllers/comment.controller.js';
import AuthController from '../controllers/auth.controller.js';

const commentController = new CommentController()
const authController = new AuthController()

export const commentRouter = express.Router()

commentRouter.route('/').get(commentController.getAll)
commentRouter.route('/').post(authController.authenticate, commentController.create)
commentRouter.route('/:id').patch(authController.authenticate, commentController.patch)
