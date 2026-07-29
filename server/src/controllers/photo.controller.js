import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";

// GET /api/events/:eventId/photos
export const listPhotos = asyncHandler(async (req, res) => {
  const result = await query(
    "select id, url, alt, position from photos where event_id = $1 order by position, created_at",
    [req.params.eventId],
  );
  res.json({ photos: result.rows });
});

// POST /api/events/:eventId/photos  (admin)
export const addPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Attach an image to upload.");

  const event = await query("select id from events where id = $1", [req.params.eventId]);
  if (event.rows.length === 0) throw new ApiError(404, "Event not found.");

  const image = await uploadImage(req.file.buffer, `gallery/${req.params.eventId}`);

  const result = await query(
    `insert into photos (event_id, url, public_id, alt, position)
     values ($1, $2, $3, $4, $5)
     returning id, url, alt, position`,
    [req.params.eventId, image.url, image.publicId, req.body.alt || null, Number(req.body.position) || 0],
  );

  res.status(201).json({ photo: result.rows[0] });
});

// DELETE /api/photos/:id  (admin)
export const deletePhoto = asyncHandler(async (req, res) => {
  const result = await query("delete from photos where id = $1 returning public_id", [
    req.params.id,
  ]);
  if (result.rows.length === 0) throw new ApiError(404, "Photo not found.");

  await deleteImage(result.rows[0].public_id);
  res.status(204).end();
});
