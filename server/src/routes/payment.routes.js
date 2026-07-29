import { Router } from "express";
import {
  submitPayment,
  listPayments,
  reviewPayment,
} from "../controllers/payment.controller.js";
import { optionalLogin, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", optionalLogin, upload.single("proof"), submitPayment);
router.get("/", requireAdmin, listPayments);
router.patch("/:id", requireAdmin, reviewPayment);

export default router;
