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
import notificationRouter from './routes/notificationRoute.js'
import connectCloudinary from './config/cloudinary.js'

dotenv.config()
const app = express();
connectDB()
connectCloudinary();


const PORT = process.env.PORT ||3000
app.use(express.json({ limit: "20mb" })); 
const allowedOrigins = [
  'https://snapfix-lets-report.onrender.com',
  'http://localhost:5173', // Local Client
  'http://localhost:5174', // Local Admin
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
 
app.use('/api/auth', authRouter)
app.use('/api/worker', workerRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/report', reportRouter)
app.use('/api/bid', bidRouter)
app.use('/api/task', taskRouter)
app.use('/api/notifications', notificationRouter)

app.get('/', (req, res)=> res.send("Backend is running"))
app.listen(PORT, ()=>console.log(`Server is running on ${PORT}`)) 