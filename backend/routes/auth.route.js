import {Router} from "express";
import {login, register, verify, logout, verify_otp} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login",login);
authRouter.post("/register",register);
authRouter.post("/verify_otp", verify_otp);
authRouter.get("/verify", verify);
authRouter.get("/logout", logout);

export default authRouter;