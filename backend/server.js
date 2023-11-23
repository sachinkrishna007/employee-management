import path from "path";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/error.js";

import adminRoute from './routes/adminRoute.js';
const port = process.env.PORT;

const app = express();
connectDB();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/admin',adminRoute)


app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log("server started at 5000"));
