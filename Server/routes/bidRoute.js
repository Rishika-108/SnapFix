import express from 'express'
import {createBid} from '../controllers/bidController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const bidRouter = express.Router();

bidRouter.post('/create-bid/:id', authMiddleware, createBid)

export default bidRouter