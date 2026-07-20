import { Router } from "express";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import {
  createRsvp,
  cancelRsvp,
  listEventRsvps,
} from "../controllers/rsvp.controller.js";
import { listPhotos, uploadPhoto } from "../controllers/photo.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// ---- Events -------------------------------------------------------------
router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", requireAdmin, upload.single("image"), createEvent);
router.patch("/:id", requireAdmin, upload.single("image"), updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);

// ---- RSVPs on an event --------------------------------------------------
router.post("/:eventId/rsvp", authenticate, createRsvp);
router.delete("/:eventId/rsvp", authenticate, cancelRsvp);
router.get("/:eventId/rsvps", requireAdmin, listEventRsvps);

// ---- Photos on an event -------------------------------------------------
router.get("/:eventId/photos", listPhotos);
router.post("/:eventId/photos", requireAdmin, upload.single("image"), uploadPhoto);

export default router;
