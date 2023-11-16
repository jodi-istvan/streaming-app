import express from 'express';
import VideoController from '../controllers/video.controller.js';

const videoController = new VideoController()

export const videoRouter = express.Router()

videoRouter.get('/stream', videoController.stream)
videoRouter.post('/upload', videoController.uploadVideoFile, videoController.create)
