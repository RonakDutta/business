import { Router } from "express";
import { deletePhoto } from "../controllers/photo.controller.js";
import { requireAdmin } from "../middleware/auth.js";

// Listing/uploading photos is nested under /events/:eventId/photos
// (see event.routes). Deleting by photo id lives here.
const router = Router();

router.delete("/:id", requireAdmin, deletePhoto);

export default router;
