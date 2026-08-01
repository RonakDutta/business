import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireLogin, getMe);

export default router;
