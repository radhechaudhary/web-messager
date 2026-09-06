import db from "../db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

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
    console.log("Login attempt for:", email);
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
    console.log("Registering user:", email, name);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.query("INSERT INTO users (email, name, password) VALUES ($1, $2, $3)", [email, name, hashedPassword]);
        res.cookie("token", jsonwebtoken.sign({email, name}, JWT_SECRET, {expiresIn: "1h"}), {httpOnly: true, maxAge: 3600000, sameSite: true});
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        if (error.code === "23505") { // unique_violation
            return res.status(400).json({message: "Email already exists"});
        }
        console.log("Error registering user:", error);
        res.status(500).json({message: "Server error"});
    }
}

const logout = (req, res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
}


export {verify, login, register, logout}