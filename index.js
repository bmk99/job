import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from './routes/auth.js';
import jobRoute from './routes/job.js';
import applicationRoute from './routes/application.js';
import { db } from "./connect.js";
import multer from "multer";
import {checkUserToken} from "./middleware/authentication.js"

dotenv.config();

const app = express();

db.connect((err) => {
    if (err) {
        console.log("Database connection failed: ", err);
    } else {
        console.log("Connected to the database.");
    }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", 
    credentials: true,
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use("/auth", authRoute);

app.use(checkUserToken)
app.use("/jobs", jobRoute);
app.use("/applications", applicationRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
