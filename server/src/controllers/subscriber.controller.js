import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

/* NEWSLETTER — the footer "Join the community" form. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribers   (public)
export const subscribe = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "That email doesn't look right.");

  await query(
    "insert into subscribers (email) values ($1) on conflict (email) do nothing",
    [email],
  );
  res.status(201).json({ ok: true });
});

// GET /api/subscribers   (admin)
export const listSubscribers = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    "select email, created_at from subscribers order by created_at desc",
  );
  res.json({ subscribers: rows });
});
