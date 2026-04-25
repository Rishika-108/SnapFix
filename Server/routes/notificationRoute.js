import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authMiddleware, getNotifications);
notificationRouter.put('/read/:id', authMiddleware, markAsRead);

export default notificationRouter;
