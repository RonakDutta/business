import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribers
export const subscribe = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new ApiError(400, "That email doesn't look right.");

  await query(
    "insert into subscribers (email) values ($1) on conflict (email) do nothing",
    [email],
  );
  res.status(201).json({ ok: true });
});

// GET /api/subscribers  (admin)
export const listSubscribers = asyncHandler(async (req, res) => {
  const result = await query(
    "select email, created_at from subscribers order by created_at desc",
  );
  res.json({ subscribers: result.rows });
});
