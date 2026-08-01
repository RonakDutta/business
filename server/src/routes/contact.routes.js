import { Router } from "express";
import { sendMessage, listMessages } from "../controllers/contact.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", sendMessage);
router.get("/", requireAdmin, listMessages);

export default router;
