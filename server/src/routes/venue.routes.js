import { Router } from "express";
import { getVenue, updateVenue } from "../controllers/venue.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getVenue);
router.patch("/:id", requireAdmin, updateVenue);

export default router;
