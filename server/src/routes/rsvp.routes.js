import { Router } from "express";
import { listMyRsvps } from "../controllers/rsvp.controller.js";
import { authenticate } from "../middleware/auth.js";

// Per-event RSVP actions live under /events/:eventId/rsvp (see event.routes).
// This router is just the caller's own list.
const router = Router();

router.get("/me", authenticate, listMyRsvps);

export default router;
