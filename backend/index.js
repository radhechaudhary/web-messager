import expreess from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// In-memory stores (placeholder until a real database is wired up)
const users = [];
const projects = [];

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const app = expreess();

app.use(cors());
app.use(expreess.json());

app.get("/", (req, res)=>{
    res.send("Email service is running");
})
import authRouter from "./routes/auth.route.js";
app.use("/auth", authRouter);

import dashboardRouter from "./routes/dashboard.route.js";
app.use("/dashboard", dashboardRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
