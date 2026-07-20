import { Router } from "express";
import {
  submitMessage,
  listMessages,
} from "../controllers/contact.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", submitMessage);
router.get("/", requireAdmin, listMessages);

export default router;
