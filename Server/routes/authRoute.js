import express from 'express'
import { loginAdmin, loginCitizen, loginWorker, registerCitizen, registerWorker } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login-citizen', loginCitizen)
authRouter.post('/register-citizen', registerCitizen)
authRouter.post('/register-worker', registerWorker)
authRouter.post('/login-worker', loginWorker)
authRouter.post('/login-admin', loginAdmin)

export default authRouter