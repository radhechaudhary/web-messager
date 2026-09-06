import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(
    path.join(__dirname, "/public")
));




import authRouter from "./routes/auth.route.js";
app.use("/auth", cors({origin: [process.env.FRONTEND_URL], credentials: true}), authRouter);

import dashboardRouter from "./routes/dashboard.route.js";
app.use("/dashboard", cors({origin: [process.env.FRONTEND_URL], credentials: true}), dashboardRouter);

import sendMailRouter from "./routes/sendmail.route.js";
app.use("/api", cors({origin: "*", credentials: false}), sendMailRouter);

app.get("/{*splat}", (req, res) => {
    res.sendFile(
        path.join(__dirname, "/public/index.html")
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
