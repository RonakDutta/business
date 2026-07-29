import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { addRowToSheet } from "../config/sheets.js";
import { env } from "../config/env.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
export const sendMessage = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const message = (req.body.message || "").trim();
  const topic = (req.body.topic || "").trim() || null;

  if (!name) throw new ApiError(400, "We'd like to know who's writing.");
  if (!EMAIL_PATTERN.test(email)) throw new ApiError(400, "That email doesn't look right.");
  if (message.length < 10) throw new ApiError(400, "Tell us a bit more.");

  await query(
    "insert into contact_messages (name, email, topic, message) values ($1, $2, $3, $4)",
    [name, email, topic, message],
  );

  // Also copy it into the Google Sheet the organisers read.
  addRowToSheet(env.sheets.contactTab, [
    new Date().toISOString(),
    name,
    email,
    topic || "",
    message,
  ]);

  res.status(201).json({ ok: true });
});

// GET /api/contact  (admin)
export const listMessages = asyncHandler(async (req, res) => {
  const result = await query("select * from contact_messages order by created_at desc");
  res.json({ messages: result.rows });
});
