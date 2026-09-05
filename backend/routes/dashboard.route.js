import {router} from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getDashboard, createProject, deleteProject } from "../controllers/dashboard.controller.js";

const router = router();

router.get("/dashboard", verifyToken, getDashboard);

router.post("/addProject", verifyToken, createProject);

router.delete("/deleteProject", verifyToken, deleteProject);

export default router;