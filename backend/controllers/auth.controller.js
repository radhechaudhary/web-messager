import db from "../db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

const JWT_SECRET = process.env.JWT_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

var pendingUserOtps = {}; // {email: {otp: "123456", name: "User Name", password: "hashedPassword", timestamp: 1234567890, attempts: 0}}

const verify = (req, res)=>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }
    try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        res.status(200).json({message: "Token is valid", user: decoded});
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
}

const login = async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "Missing required fields"});
    }
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    // console.log("User found:", user.rows);
    if (user.rows.length === 0) {
        return res.status(404).json({message: "User not found"});
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
        return res.status(401).json({message: "Invalid credentials"});
    }
    const token = jsonwebtoken.sign({email: user.rows[0].email, name: user.rows[0].name}, JWT_SECRET, {expiresIn: "1h"});
    res.cookie("token", token, {httpOnly: true, maxAge: 3600000, sameSite: true});
    res.status(200).json({message: "Login successful", name: user.rows[0].name});
}   


const register = async (req, res)=>{
    const {email, name, password} = req.body;
    if(!email || !name || !password) {
        return res.status(400).json({message: "Missing required fields"});
    }
    console.log("Registering user:", email, name);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({message: "Email already exists"});
        }
        const otp = crypto.randomInt(100000, 1000000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        pendingUserOtps[email] = {otp, name, password: hashedPassword, timestamp: Date.now(), attempts: 0};

        try {
            await resend.emails.send({
                from: process.env.RESEND_EMAIL_ID,
                to: email,
                subject: "Verify your email",
                text: `Hi ${name},\n\nYour verification code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`
            });
        } catch (mailError) {
            console.error("Error sending OTP email:", mailError);
        }

        res.status(201).json({message: "OTP sent to email"});
    } catch (error) {
        if (error.code === "23505") { // unique_violation
            return res.status(400).json({message: "Email already exists"});
        }
        console.log("Error registering user:", error);
        res.status(500).json({message: "Server error"});
    }
}

const verify_otp = async (req, res)=>{
    const {email, otp} = req.body;
    if(!email || !otp) {
        return res.status(400).json({message: "Missing required fields"});
    }
    const pendingUser = pendingUserOtps[email];
    if(!pendingUser) {
        return res.status(400).json({message: "No pending registration found for this email"});
    }
    if(Date.now() - pendingUser.timestamp > OTP_EXPIRY_MS) {
        delete pendingUserOtps[email];
        return res.status(400).json({message: "OTP has expired. Please register again"});
    }
    if(pendingUser.otp !== otp) {
        pendingUser.attempts++;
        if(pendingUser.attempts >= 3) {
            delete pendingUserOtps[email];
            return res.status(400).json({message: "Too many invalid OTP attempts. Please register again"});
        }
        return res.status(400).json({message: "Invalid OTP"});
    }
    // OTP is valid, finalize registration
    try {
        await db.query("INSERT INTO users (email, name, password) VALUES ($1, $2, $3)", [email, pendingUser.name, pendingUser.password]);
        delete pendingUserOtps[email]; // Remove from pending
        res.cookie("token", jsonwebtoken.sign({email, name: pendingUser.name}, JWT_SECRET, {expiresIn: "1h"}), {httpOnly: true, maxAge: 3600000, sameSite: true});
        res.status(201).json({message: "User registered successfully", name: pendingUser.name});
    } catch (error) {
        console.log("Error finalizing registration:", error);
        res.status(500).json({message: "Server error"});
    }
}

const logout = (req, res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
}


export {verify, login, register, logout, verify_otp};