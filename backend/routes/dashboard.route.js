import {Router} from "express";
import verifyToken from "../middlewares/verifytoken.middleware.js";
import { getDashboard, createProject, deleteProject } from "../controllers/dashboard.controller.js";


const dashboardRouter = Router();

dashboardRouter.get("/projects", verifyToken, getDashboard);

dashboardRouter.post("/addProject", verifyToken, createProject);

dashboardRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

export default dashboardRouter;