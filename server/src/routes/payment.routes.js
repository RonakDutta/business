import { Router } from "express";
import {
  submitProof,
  listPayments,
  reviewPayment,
} from "../controllers/payment.controller.js";
import { optionalAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", optionalAuth, upload.single("proof"), submitProof);
router.get("/", requireAdmin, listPayments);
router.patch("/:id", requireAdmin, reviewPayment);

export default router;
