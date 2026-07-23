import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadBuffer, destroyAsset } from "../config/cloudinary.js";

/* ---------------------------------------------------------------------------
   EVENTS (meetups).

   Public: list + get. Admin: create / update / delete / cancel.
   Status is derived from the date, exactly like the frontend's events-model:
   a meetup that hasn't ended yet is "upcoming", otherwise "past"; `cancelled`
   overrides both. Meetups run 11:00-13:00 IST, so "ended" is date + 13:00 IST.
   --------------------------------------------------------------------------- */

function withStatus(row) {
  const endsAt = new Date(`${toISODate(row.event_date)}T13:00:00+05:30`);
  const isPast = endsAt.getTime() < Date.now();
  return {
    id: row.id,
    date: toISODate(row.event_date),
    title: row.title,
    entryFee: row.entry_fee,
    description: row.description || [],
    image: row.image_url,
    attendeeCount: row.attendee_count,
    cancelled: row.cancelled,
    venueId: row.venue_id,
    locationOverride: row.location_override,
    status: row.cancelled ? "cancelled" : isPast ? "past" : "upcoming",
    isPast,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const toISODate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);

// GET /api/events?status=upcoming|past|all
export const listEvents = asyncHandler(async (req, res) => {
  const { rows } = await query("select * from events order by event_date desc");

  // One extra query for every event's photo URLs, grouped by event — so the
  // client gets galleries in the same round-trip instead of one call per event.
  const photoRows = await query(
    "select event_id, url from photos order by position, created_at",
  );
  const photosByEvent = {};
  for (const p of photoRows.rows) (photosByEvent[p.event_id] ??= []).push(p.url);

  let events = rows.map((r) => ({
    ...withStatus(r),
    photos: photosByEvent[r.id] || [],
  }));

  const status = req.query.status;
  if (status === "upcoming")
    events = events.filter((e) => !e.isPast).sort((a, b) => a.date.localeCompare(b.date));
  else if (status === "past")
    events = events.filter((e) => e.isPast && !e.cancelled);

  res.json({ events });
});

// GET /api/events/:id
export const getEvent = asyncHandler(async (req, res) => {
  const { rows } = await query("select * from events where id = $1", [req.params.id]);
  if (!rows[0]) throw new ApiError(404, "Event not found.");

  const photoRows = await query(
    "select url from photos where event_id = $1 order by position, created_at",
    [req.params.id],
  );

  res.json({
    event: { ...withStatus(rows[0]), photos: photoRows.rows.map((p) => p.url) },
  });
});

// POST /api/events   (admin) — optional cover image via multipart "image"
export const createEvent = asyncHandler(async (req, res) => {
  const { date, title, entryFee, description, attendeeCount, venueId } = req.body;
  if (!date) throw new ApiError(400, "A meetup needs a date.");

  let image = {};
  if (req.file) image = await uploadBuffer(req.file.buffer, "events");

  const { rows } = await query(
    `insert into events
       (event_date, title, entry_fee, description, attendee_count, image_url, image_public_id, venue_id)
     values ($1, $2, coalesce($3, 150), $4, coalesce($5, 0), $6, $7, $8)
     returning *`,
    [
      date,
      title || undefined,
      entryFee != null ? Number(entryFee) : null,
      parseDescription(description),
      attendeeCount != null ? Number(attendeeCount) : null,
      image.url || null,
      image.publicId || null,
      venueId || null,
    ],
  );
  res.status(201).json({ event: withStatus(rows[0]) });
});

// PATCH /api/events/:id   (admin)
export const updateEvent = asyncHandler(async (req, res) => {
  const { rows: existing } = await query("select * from events where id = $1", [
    req.params.id,
  ]);
  if (!existing[0]) throw new ApiError(404, "Event not found.");

  const current = existing[0];
  let imageUrl = current.image_url;
  let imagePublicId = current.image_public_id;
  if (req.file) {
    if (imagePublicId) await destroyAsset(imagePublicId);
    const uploaded = await uploadBuffer(req.file.buffer, "events");
    imageUrl = uploaded.url;
    imagePublicId = uploaded.publicId;
  }

  const b = req.body;
  const { rows } = await query(
    `update events set
       event_date     = coalesce($2, event_date),
       title          = coalesce($3, title),
       entry_fee      = coalesce($4, entry_fee),
       description    = coalesce($5, description),
       attendee_count = coalesce($6, attendee_count),
       cancelled      = coalesce($7, cancelled),
       venue_id       = coalesce($8, venue_id),
       image_url      = $9,
       image_public_id = $10,
       updated_at     = now()
     where id = $1
     returning *`,
    [
      req.params.id,
      b.date || null,
      b.title || null,
      b.entryFee != null ? Number(b.entryFee) : null,
      b.description != null ? parseDescription(b.description) : null,
      b.attendeeCount != null ? Number(b.attendeeCount) : null,
      b.cancelled != null ? Boolean(b.cancelled) : null,
      b.venueId || null,
      imageUrl,
      imagePublicId,
    ],
  );
  res.json({ event: withStatus(rows[0]) });
});

// DELETE /api/events/:id   (admin)
export const deleteEvent = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "delete from events where id = $1 returning image_public_id",
    [req.params.id],
  );
  if (!rows[0]) throw new ApiError(404, "Event not found.");
  if (rows[0].image_public_id) await destroyAsset(rows[0].image_public_id);
  res.status(204).end();
});

/** Accept description as a JSON array, a real array, or newline-split text. */
function parseDescription(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* not JSON — treat as text */
  }
  return String(value).split("\n").map((s) => s.trim()).filter(Boolean);
}
