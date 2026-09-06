import db from "../db.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getDashboard = async (req, res)=>{
    try{
        const email = req.user.email;
        const data = await db.query(`SELECT * FROM projects WHERE user_email = $1`, [email]);
        // console.log("data", data.rows)
        res.status(200).json({
            success: true,
            projects: data.rows,
            user:req.user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching projects."
        })
    }
}

const createProject = async (req, res)=>{
    try {
        const { name, domain } = req.body;
        const email = req.user.email;
        console.log("Creating project for user:", email, "with name:", name, "and domain:", domain);
        const data = await db.query(`INSERT INTO projects (name, domain, api_key, user_email) VALUES ($1, $2, $3, $4) returning id`, [name, domain, 'abc', email]);
        const id = data.rows[0].id;
        const apiKey = await jsonwebtoken.sign({ id, email, name, domain }, process.env.JWT_SECRET, { expiresIn: "1y" });
        const updatedProject = await db.query(`Update projects set api_key = $1 where id = $2 returning *`, [apiKey, id]);
        res.status(201).json({
            success: true,
            project: updatedProject.rows[0]
        })
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the project."
        })
    }
}

const deleteProject = async (req, res)=>{
    try {
        const { id } = req.params;
        const email = req.user.email;
        const data = await db.query(`DELETE FROM projects WHERE id = $1 AND user_email = $2 returning *`, [id, email]);
        if(data.rowCount === 0){
            return res.status(404).json({
                success: false,
                message: "Project not found or you do not have permission to delete it."
            })
        }
        res.status(200).json({
            success: true,
            message: "Project deleted successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the project."
        })
    }
}


const getProjectAnalytics = async (req, res)=>{
    try {
        const { id } = req.params;
        const email = req.user.email;
        const projectData = await db.query(
            `SELECT id, name, message_count, daily_message_count, daily_limit, last_reset FROM projects WHERE id = $1 AND user_email = $2`,
            [id, email]
        );
        if (projectData.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you do not have permission to view it."
            })
        }
        const project = projectData.rows[0];
        const today = new Date().toISOString().split("T")[0];
        const lastReset = project.last_reset ? new Date(project.last_reset).toISOString().split("T")[0] : null;
        const dailyMessageCount = lastReset === today ? project.daily_message_count : 0;
        const dailyLimit = project.daily_limit ?? 100;
        const remainingToday = Math.max(dailyLimit - dailyMessageCount, 0);

        const recentMessages = await db.query(
            `SELECT id, sender_email, sender_name, subject, message, created_at
             FROM messages WHERE project_id = $1 ORDER BY created_at DESC LIMIT 5`,
            [id]
        );

        res.status(200).json({
            success: true,
            analytics: {
                totalMessages: project.message_count,
                dailyMessageCount,
                dailyLimit,
                remainingToday,
                recentMessages: recentMessages.rows
            }
        })
    } catch (error) {
        console.error("Error fetching project analytics:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching analytics."
        })
    }
}

export {getDashboard, createProject, deleteProject, getProjectAnalytics}