import { Router } from "express";
import {
  listSaved,
  saveEvent,
  unsaveEvent,
} from "../controllers/saved.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, listSaved);
router.put("/:eventId", authenticate, saveEvent);
router.delete("/:eventId", authenticate, unsaveEvent);

export default router;
