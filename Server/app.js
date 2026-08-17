import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRoute.js";
import workerRouter from "./routes/workerRoute.js";
import reportRouter from "./routes/reportRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import bidRouter from "./routes/bidRoute.js";
import taskRouter from "./routes/taskRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));

const allowedOrigins = [
    "https://snapfix-lets-report.onrender.com",
    "https://snapfix-my-gov.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                return callback(null, true);
            }

            if (!allowedOrigins.includes(origin)) {
                return callback(
                    new Error("Origin not allowed"),
                    false
                );
            }

            callback(null, true);
        }
    })
);

app.use("/api/auth", authRouter);
app.use("/api/worker", workerRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/report", reportRouter);
app.use("/api/bid", bidRouter);
app.use("/api/task", taskRouter);
app.use("/api/notifications", notificationRouter);

export default app;