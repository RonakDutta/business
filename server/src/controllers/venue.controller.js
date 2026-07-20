import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

/* VENUE — the meetup location (frontend client/src/data/venue.js). One default
   venue is returned to the public; an admin can update it. */

const shape = (r) => ({
  id: r.id,
  name: r.name,
  shortName: r.short_name,
  address: r.address,
  city: r.city,
  gate: r.gate,
  entryNote: r.entry_note,
  metro: r.metro,
  helpline: r.helpline,
  helplineNote: r.helpline_note,
  isDefault: r.is_default,
});

// GET /api/venue   (public) — the default venue
export const getVenue = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    "select * from venues order by is_default desc, created_at limit 1",
  );
  res.json({ venue: rows[0] ? shape(rows[0]) : null });
});

// PATCH /api/venue/:id   (admin)
export const updateVenue = asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows } = await query(
    `update venues set
       name = coalesce($2, name),
       short_name = coalesce($3, short_name),
       address = coalesce($4, address),
       city = coalesce($5, city),
       gate = coalesce($6, gate),
       entry_note = coalesce($7, entry_note),
       metro = coalesce($8, metro),
       helpline = coalesce($9, helpline),
       helpline_note = coalesce($10, helpline_note)
     where id = $1 returning *`,
    [
      req.params.id,
      b.name || null, b.shortName || null, b.address || null, b.city || null,
      b.gate || null, b.entryNote || null,
      b.metro != null ? JSON.stringify(b.metro) : null,
      b.helpline || null, b.helplineNote || null,
    ],
  );
  if (!rows[0]) throw new ApiError(404, "Venue not found.");
  res.json({ venue: shape(rows[0]) });
});
