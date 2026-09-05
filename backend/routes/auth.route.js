import {Router} from "express";
import {login, register, verify, logout} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login",login);
authRouter.post("/register",register);
authRouter.get("/verify", verify);
authRouter.get("/logout", logout);

export default authRouter;