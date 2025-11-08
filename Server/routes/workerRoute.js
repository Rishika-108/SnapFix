import express from 'express'
import { getReportsByLocation, getWorkerProfile } from '../controllers/workerController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const workerRouter = express.Router()

workerRouter.get('/location', authMiddleware, getReportsByLocation)
workerRouter.get('/profile',authMiddleware, getWorkerProfile)

export default workerRouter