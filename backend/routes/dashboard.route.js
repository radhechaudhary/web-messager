import {Router} from "express";
import verifyToken from "../middlewares/verifytoken.middleware.js";
import { getDashboard, createProject, deleteProject, getProjectAnalytics } from "../controllers/dashboard.controller.js";


const dashboardRouter = Router();

dashboardRouter.get("/projects", verifyToken, getDashboard);

dashboardRouter.post("/addProject", verifyToken, createProject);

dashboardRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

dashboardRouter.get("/projects/:id/analytics", verifyToken, getProjectAnalytics);

export default dashboardRouter;