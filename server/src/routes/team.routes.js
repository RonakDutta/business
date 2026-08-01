import { Router } from "express";
import {
  listTeam,
  addMember,
  updateMember,
  deleteMember,
} from "../controllers/team.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listTeam);
router.post("/", requireAdmin, upload.single("image"), addMember);
router.patch("/:id", requireAdmin, upload.single("image"), updateMember);
router.delete("/:id", requireAdmin, deleteMember);

export default router;
