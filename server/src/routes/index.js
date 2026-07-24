import { Router } from "express";
import { ping } from "../config/db.js";
import { isCloudinaryConfigured } from "../config/cloudinary.js";
import { isSheetsConfigured } from "../config/sheets.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import authRoutes from "./auth.routes.js";
import eventRoutes from "./event.routes.js";
import rsvpRoutes from "./rsvp.routes.js";
import savedRoutes from "./saved.routes.js";
import photoRoutes from "./photo.routes.js";
import teamRoutes from "./team.routes.js";
import paymentRoutes from "./payment.routes.js";
import subscriberRoutes from "./subscriber.routes.js";
import contactRoutes from "./contact.routes.js";
import venueRoutes from "./venue.routes.js";

/*
  The API surface, all under /api. Kept in one place so the whole route map is
  readable at a glance:

    GET    /api/health

    POST   /api/auth/register            POST /api/auth/login    GET /api/auth/me
    GET    /api/events                    GET  /api/events/:id
    POST   /api/events                    PATCH/DELETE /api/events/:id      (admin)
    POST   /api/events/:id/rsvp           DELETE /api/events/:id/rsvp
    GET    /api/events/:id/rsvps          (admin)
    GET    /api/events/:id/photos         POST /api/events/:id/photos       (admin)
    DELETE /api/photos/:id                (admin)
    GET    /api/rsvps/me
    GET/PUT/DELETE /api/saved[/:eventId]
    GET    /api/team                      POST/PATCH/DELETE /api/team[/:id]  (admin)
    POST   /api/payments                  GET /api/payments  PATCH /api/payments/:id (admin)
    POST   /api/subscribers               GET /api/subscribers               (admin)
    POST   /api/contact                   GET /api/contact                   (admin)
    GET    /api/venue                     PATCH /api/venue/:id               (admin)
*/

const router = Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    let db = false;
    try {
      db = await ping();
    } catch {
      db = false;
    }
    res.json({
      ok: true,
      db,
      cloudinary: isCloudinaryConfigured,
      sheets: isSheetsConfigured,
      time: new Date().toISOString(),
    });
  }),
);

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/rsvps", rsvpRoutes);
router.use("/saved", savedRoutes);
router.use("/photos", photoRoutes);
router.use("/team", teamRoutes);
router.use("/payments", paymentRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/contact", contactRoutes);
router.use("/venue", venueRoutes);

export default router;
