import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";

const DEFAULT_TITLE = "Business4.0 Meetup (Entry Fee Applicable)";

// Meetups run 11am-1pm IST, so an event is "past" once 1pm on its date has gone.
function isPastEvent(eventDate) {
  const endTime = new Date(`${eventDate}T13:00:00+05:30`);
  return endTime.getTime() < Date.now();
}

function formatEvent(row, photos = [], attendees = []) {
  const past = isPastEvent(row.event_date);

  return {
    id: row.id,
    date: row.event_date,
    title: row.title,
    entryFee: row.entry_fee,
    description: row.description || [],
    image: row.image_url,
    attendeeCount: row.attendee_count,
    cancelled: row.cancelled,
    isPast: past,
    status: row.cancelled ? "cancelled" : past ? "past" : "upcoming",
    photos,
    attendees,
  };
}

// Description can arrive as a real array, a JSON string, or plain paragraphs.
function toParagraphs(description) {
  if (description === undefined || description === null) return null;
  if (Array.isArray(description)) return description;

  try {
    const parsed = JSON.parse(description);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, treat it as text below
  }

  return String(description)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// GET /api/events
export const listEvents = asyncHandler(async (req, res) => {
  const eventRows = await query("select * from events order by event_date desc");
  const photoRows = await query(
    "select event_id, url from photos order by position, created_at",
  );
  const attendeeRows = await query(
    `select r.event_id, u.id, u.name
     from rsvps r
     join users u on u.id = r.user_id
     where r.status = 'going'
     order by r.created_at`,
  );

  const events = eventRows.rows.map((row) => {
    const photos = photoRows.rows
      .filter((photo) => photo.event_id === row.id)
      .map((photo) => photo.url);

    const attendees = attendeeRows.rows
      .filter((attendee) => attendee.event_id === row.id)
      .map((attendee) => ({ id: attendee.id, name: attendee.name }));

    return formatEvent(row, photos, attendees);
  });

  res.json({ events });
});

// GET /api/events/:id
export const getEvent = asyncHandler(async (req, res) => {
  const eventRows = await query("select * from events where id = $1", [req.params.id]);
  if (eventRows.rows.length === 0) throw new ApiError(404, "Event not found.");

  const photoRows = await query(
    "select url from photos where event_id = $1 order by position, created_at",
    [req.params.id],
  );
  const attendeeRows = await query(
    `select u.id, u.name
     from rsvps r
     join users u on u.id = r.user_id
     where r.event_id = $1 and r.status = 'going'
     order by r.created_at`,
    [req.params.id],
  );

  const photos = photoRows.rows.map((photo) => photo.url);
  const attendees = attendeeRows.rows.map((row) => ({ id: row.id, name: row.name }));

  res.json({ event: formatEvent(eventRows.rows[0], photos, attendees) });
});

// POST /api/events  (admin). The cover image is optional.
export const createEvent = asyncHandler(async (req, res) => {
  const { date, title, entryFee, description, attendeeCount } = req.body;
  if (!date) throw new ApiError(400, "A meetup needs a date.");

  let image = { url: null, publicId: null };
  if (req.file) image = await uploadImage(req.file.buffer, "events");

  const result = await query(
    `insert into events
       (event_date, title, entry_fee, description, attendee_count, image_url, image_public_id)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [
      date,
      (title || "").trim() || DEFAULT_TITLE,
      Number(entryFee) || 0,
      toParagraphs(description),
      Number(attendeeCount) || 0,
      image.url,
      image.publicId,
    ],
  );

  res.status(201).json({ event: formatEvent(result.rows[0]) });
});

// PATCH /api/events/:id  (admin). Only the fields that were sent are changed.
export const updateEvent = asyncHandler(async (req, res) => {
  const existing = await query("select * from events where id = $1", [req.params.id]);
  if (existing.rows.length === 0) throw new ApiError(404, "Event not found.");

  const event = existing.rows[0];
  let imageUrl = event.image_url;
  let imagePublicId = event.image_public_id;

  if (req.file) {
    await deleteImage(imagePublicId);
    const image = await uploadImage(req.file.buffer, "events");
    imageUrl = image.url;
    imagePublicId = image.publicId;
  }

  const { date, title, entryFee, description, attendeeCount, cancelled } = req.body;

  const result = await query(
    `update events set
       event_date = $2,
       title = $3,
       entry_fee = $4,
       description = $5,
       attendee_count = $6,
       cancelled = $7,
       image_url = $8,
       image_public_id = $9,
       updated_at = now()
     where id = $1
     returning *`,
    [
      req.params.id,
      date || event.event_date,
      (title || "").trim() || event.title,
      entryFee === undefined ? event.entry_fee : Number(entryFee),
      toParagraphs(description) || event.description,
      attendeeCount === undefined ? event.attendee_count : Number(attendeeCount),
      cancelled === undefined ? event.cancelled : cancelled === true || cancelled === "true",
      imageUrl,
      imagePublicId,
    ],
  );

  res.json({ event: formatEvent(result.rows[0]) });
});

// DELETE /api/events/:id  (admin)
export const deleteEvent = asyncHandler(async (req, res) => {
  const result = await query(
    "delete from events where id = $1 returning image_public_id",
    [req.params.id],
  );
  if (result.rows.length === 0) throw new ApiError(404, "Event not found.");

  await deleteImage(result.rows[0].image_public_id);
  res.status(204).end();
});
