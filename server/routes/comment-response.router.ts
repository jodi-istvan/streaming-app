import express from 'express';
import CommentResponseController from '../controllers/comment-response.controller.js';
import AuthController from '../controllers/auth.controller.js';

const commentResponseController = new CommentResponseController()
const authController = new AuthController()

export const commentResponseRouter = express.Router()

commentResponseRouter.route('/').get(commentResponseController.getAll)
commentResponseRouter.route('/').post(authController.authenticate, commentResponseController.create)
commentResponseRouter.route('/:id').patch(authController.authenticate, commentResponseController.patch)
