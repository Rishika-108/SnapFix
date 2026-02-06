import express from 'express'
import {getMyTasks, getTaskDetail, uploadProof, verifyByCitizen } from '../controllers/taskController.js';
import upload from '../middleware/multer.js';
import authMiddleware from '../middleware/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.post('/proof-upload/:id',authMiddleware,upload.single("image"), uploadProof)
taskRouter.post('/verify/:id', authMiddleware ,verifyByCitizen)
taskRouter.get('/my-tasks', authMiddleware, getMyTasks)
taskRouter.get('/:id', authMiddleware ,getTaskDetail)

export default taskRouter