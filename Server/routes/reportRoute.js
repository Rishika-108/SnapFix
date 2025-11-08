import express from 'express'
import { createReport, getParticularReports, getReportsByLocation, upvoteAReport } from '../controllers/ReportController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js'

const reportRouter = express.Router()

reportRouter.post('/create-report', authMiddleware, upload.single("image"),createReport)
reportRouter.get('/get-report/:id', getParticularReports)
reportRouter.post('/upvote/:id',authMiddleware, upvoteAReport)
reportRouter.get('/location', authMiddleware, getReportsByLocation)

export default reportRouter