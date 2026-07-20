import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

/* CONTACT — the form on /contact (frontend opens a mailto today; this stores
   the message so nothing is lost and an admin can triage). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact   (public)
export const submitMessage = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const message = (req.body.message || "").trim();
  const topic = (req.body.topic || "").trim() || null;

  if (!name) throw new ApiError(400, "We'd like to know who's writing.");
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "That email doesn't look right.");
  if (message.length < 10) throw new ApiError(400, "Tell us a bit more.");

  await query(
    "insert into contact_messages (name, email, topic, message) values ($1,$2,$3,$4)",
    [name, email, topic, message],
  );
  res.status(201).json({ ok: true });
});

// GET /api/contact   (admin)
export const listMessages = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    "select * from contact_messages order by created_at desc",
  );
  res.json({ messages: rows });
});
