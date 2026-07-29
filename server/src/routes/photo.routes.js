import { Router } from "express";
import { deletePhoto } from "../controllers/photo.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.delete("/:id", requireAdmin, deletePhoto);

export default router;
