import express from 'express'
import { approveBid, paymentRelease, viewAllReports, viewReportWithBid } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.get("/all-reports", authMiddleware,viewAllReports)
adminRouter.get("/bids/:id", authMiddleware,viewReportWithBid)
adminRouter.put('/approve-bid/:id',authMiddleware,approveBid )
adminRouter.post('/release-payment/:id', /*authMiddleware,*/ paymentRelease)
export default adminRouter