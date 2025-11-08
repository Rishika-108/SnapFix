import express from 'express'
import {createBid, getBidOnReport} from '../controllers/bidController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const bidRouter = express.Router();

bidRouter.post('/create-bid/:id', authMiddleware, createBid)
bidRouter.get('/getBid-report/:id', getBidOnReport)

export default bidRouter