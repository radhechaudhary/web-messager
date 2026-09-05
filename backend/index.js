import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();



const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res)=>{
    res.send("Email service is running");
})
import authRouter from "./routes/auth.route.js";
app.use("/auth", authRouter);

import dashboardRouter from "./routes/dashboard.route.js";
app.use("/dashboard", dashboardRouter);

import sendMailRouter from "./routes/sendmail.route.js";
app.use("/api", sendMailRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
