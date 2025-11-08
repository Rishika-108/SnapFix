import express from 'express'
import { myReports } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/my-reports', authMiddleware, myReports)

export default userRouter