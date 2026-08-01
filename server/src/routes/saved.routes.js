import { Router } from "express";
import { listSaved, saveEvent, unsaveEvent } from "../controllers/saved.controller.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireLogin, listSaved);
router.put("/:eventId", requireLogin, saveEvent);
router.delete("/:eventId", requireLogin, unsaveEvent);

export default router;
