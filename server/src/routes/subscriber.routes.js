import { Router } from "express";
import {
  subscribe,
  listSubscribers,
} from "../controllers/subscriber.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", subscribe);
router.get("/", requireAdmin, listSubscribers);

export default router;
