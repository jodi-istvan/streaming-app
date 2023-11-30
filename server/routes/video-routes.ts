import express from 'express';
import VideoController from '../controllers/video.controller.js';
import AuthController from '../controllers/auth.controller.js';

const videoController = new VideoController()
const authController = new AuthController()

export const videoRouter = express.Router()

videoRouter.get('/:id', videoController.get)
videoRouter.post('/', authController.authenticate, videoController.uploadVideoFile, videoController.create)
videoRouter.delete('/:id', authController.authenticate, videoController.delete)
videoRouter.patch('/like/:id', authController.authenticate, videoController.patchLikeVideo)
