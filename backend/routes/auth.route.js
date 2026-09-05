import {router} from "express";
import {login, register} from "../controllers/auth.controller.js";

const authRouter = router();

router.post("/login",login);
router.post("/register",register);

export default authRouter;