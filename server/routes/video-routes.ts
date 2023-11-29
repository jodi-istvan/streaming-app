import express from 'express';
import VideoController from '../controllers/video.controller.js';

const videoController = new VideoController()

export const videoRouter = express.Router()

videoRouter.get('/:id', videoController.get)
videoRouter.post('/', videoController.uploadVideoFile, videoController.create)
videoRouter.delete('/:id', videoController.delete)
