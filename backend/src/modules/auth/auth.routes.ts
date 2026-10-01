import { Router } from "express";
import { register, login, logout, check, refresh } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";


const router = Router();

router.post("/register", validate({ body: registerSchema }), register);

router.post("/login", validate({ body: loginSchema }), login);

router.post("/logout", logout);
router.get("/check", check);
router.post("/refresh", refresh);

export default router;
