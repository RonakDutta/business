import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadBuffer, destroyAsset } from "../config/cloudinary.js";

/* ---------------------------------------------------------------------------
   GALLERY PHOTOS, per event. Public list; admin upload/delete. Uploads stream
   to Cloudinary and store the returned URL + public_id (so we can delete the
   asset too, not just the row).
   --------------------------------------------------------------------------- */

// GET /api/events/:eventId/photos
export const listPhotos = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "select id, url, alt, position from photos where event_id = $1 order by position, created_at",
    [req.params.eventId],
  );
  res.json({ photos: rows });
});

// POST /api/events/:eventId/photos   (admin) — multipart "image"
export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Attach an image to upload.");

  const event = await query("select id from events where id = $1", [req.params.eventId]);
  if (!event.rowCount) throw new ApiError(404, "Event not found.");

  const { url, publicId } = await uploadBuffer(
    req.file.buffer,
    `gallery/${req.params.eventId}`,
  );

  const { rows } = await query(
    `insert into photos (event_id, url, public_id, alt, position)
     values ($1, $2, $3, $4, coalesce($5, 0)) returning id, url, alt, position`,
    [req.params.eventId, url, publicId, req.body.alt || null, req.body.position],
  );
  res.status(201).json({ photo: rows[0] });
});

// DELETE /api/photos/:id   (admin)
export const deletePhoto = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "delete from photos where id = $1 returning public_id",
    [req.params.id],
  );
  if (!rows[0]) throw new ApiError(404, "Photo not found.");
  if (rows[0].public_id) await destroyAsset(rows[0].public_id);
  res.status(204).end();
});
