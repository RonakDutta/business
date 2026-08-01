import { Router } from "express";
import { listMyRsvps } from "../controllers/rsvp.controller.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireLogin, listMyRsvps);

export default router;
