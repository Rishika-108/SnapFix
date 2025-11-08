import express from 'express'
import { paymentFunction, paymentRelease } from '../controllers/paymentController';

const paymentRouter = express.Router();

paymentRouter.post('/release', paymentRelease)
paymentRouter.post('/webhook', paymentFunction)

export default paymentRouter