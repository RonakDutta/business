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
  listEventAttendees,
} from "../controllers/rsvp.controller.js";
import { listPhotos, addPhoto } from "../controllers/photo.controller.js";
import { requireLogin, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", requireAdmin, upload.single("image"), createEvent);
router.patch("/:id", requireAdmin, upload.single("image"), updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);

router.post("/:eventId/rsvp", requireLogin, createRsvp);
router.delete("/:eventId/rsvp", requireLogin, cancelRsvp);
router.get("/:eventId/rsvps", requireAdmin, listEventAttendees);

router.get("/:eventId/photos", listPhotos);
router.post("/:eventId/photos", requireAdmin, upload.single("image"), addPhoto);

export default router;
