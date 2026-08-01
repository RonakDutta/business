import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/saved
export const listSaved = asyncHandler(async (req, res) => {
  const result = await query("select event_id from saved_events where user_id = $1", [
    req.user.id,
  ]);
  res.json({ savedEventIds: result.rows.map((row) => row.event_id) });
});

// PUT /api/saved/:eventId
export const saveEvent = asyncHandler(async (req, res) => {
  await query(
    `insert into saved_events (user_id, event_id) values ($1, $2)
     on conflict (user_id, event_id) do nothing`,
    [req.user.id, req.params.eventId],
  );
  res.status(204).end();
});

// DELETE /api/saved/:eventId
export const unsaveEvent = asyncHandler(async (req, res) => {
  await query("delete from saved_events where user_id = $1 and event_id = $2", [
    req.user.id,
    req.params.eventId,
  ]);
  res.status(204).end();
});
