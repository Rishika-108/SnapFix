import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/authRoute.js'
import { connectDB } from './config/db.js'
import workerRouter from './routes/workerRoute.js'
import reportRouter from './routes/reportRoute.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import bidRouter from './routes/bidRoute.js'
import taskRouter from './routes/taskRoute.js'
import connectCloudinary from './config/cloudinary.js'

dotenv.config()
const app = express();
connectDB()
connectCloudinary();


const PORT = 3000
app.use(express.json({ limit: "20mb" })); 
app.use(cors())
 
app.use('/api/auth', authRouter)
app.use('/api/worker', workerRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/report', reportRouter)
app.use('/api/bid', bidRouter)
app.use('/api/task', taskRouter)

app.get('/', (req, res)=> res.send("Backend is running"))
app.listen(PORT, ()=>console.log(`Server is running on ${PORT}`))