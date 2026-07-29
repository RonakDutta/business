import { Router } from "express";
import { isDatabaseReachable } from "../config/db.js";
import { isCloudinaryConfigured } from "../config/cloudinary.js";
import { isSheetsConfigured } from "../config/sheets.js";

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

const router = Router();

router.get("/health", async (req, res) => {
  res.json({
    ok: true,
    database: await isDatabaseReachable(),
    cloudinary: isCloudinaryConfigured,
    sheets: isSheetsConfigured,
  });
});

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
