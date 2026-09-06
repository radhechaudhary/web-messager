import {Router} from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import db from "../db.js";
import dns from "dns";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, (err, address, family) => {
            console.log("SMTP IPv4:", address, family);

            if (err) {
                return callback(err);
            }

            callback(null, address, family);
        });
    },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
await transporter.verify().then(() => {
    console.log("SMTP server is ready to take messages");
}).catch((err) => {
    console.error("Error setting up SMTP server:", err);
});

const router = Router();

router.post("/send-message", async (req, res) => {
    const { from , subject, message, api, name } = req.body;
    if(!from || !message || !api ){
        return res.status(400).json({ message: "Missing required fields" });
    }

    try{
        const user = await jsonwebtoken.verify(api, process.env.JWT_SECRET);
        req.user = user;
    }
    catch{
        return res.status(401).json({ message: "Invalid Api Key" });
    }

    try {
        // if(req.headers.domain !== req.user.domain){
        //     return res.status(403).json({ message: "Domain mismatch. You are not authorized to send emails from this domain." });
        // }
        const id = req.user.id;
        console.log(id);
        const dailyLimit = 100; // Set your daily limit here
        const projectData = await db.query(`SELECT message_count, daily_message_count, last_reset FROM projects WHERE id = $1`, [id]);
        if(projectData.rowCount === 0){
            return res.status(404).json({ message: "Project not found" });
        }
        var { message_count, daily_message_count, last_reset } = projectData.rows[0];
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        if(last_reset !== today){
            // Reset daily count if it's a new day
            await db.query(`UPDATE projects SET daily_message_count = 0, last_reset = $1 WHERE id = $2`, [today, id]);
            daily_message_count = 0;
        }

        if(daily_message_count >= dailyLimit){
            return res.status(429).json({ message: "Daily limit reached. You cannot send more emails today." });
        }
        await db.query(`UPDATE projects SET message_count = message_count + 1, daily_message_count = daily_message_count + 1 WHERE id = $1`, [id]);
        const to = req.user.email; // Send email to the user's registered email
        // You can customize the email content here
        const text = `From: ${from}\n\nname: ${name || "Anonymous"}\n\n${message}`; 
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        });
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

export default router;