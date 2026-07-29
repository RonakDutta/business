import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

function formatVenue(row) {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    address: row.address,
    city: row.city,
    gate: row.gate,
    metro: row.metro,
    helpline: row.helpline,
    helplineNote: row.helpline_note,
  };
}

// GET /api/venue
export const getVenue = asyncHandler(async (req, res) => {
  const result = await query(
    "select * from venues order by is_default desc, created_at limit 1",
  );
  res.json({ venue: result.rows[0] ? formatVenue(result.rows[0]) : null });
});

// PATCH /api/venue/:id  (admin)
export const updateVenue = asyncHandler(async (req, res) => {
  const existing = await query("select * from venues where id = $1", [req.params.id]);
  if (existing.rows.length === 0) throw new ApiError(404, "Venue not found.");

  const venue = existing.rows[0];
  const { name, shortName, address, city, gate, metro, helpline, helplineNote } = req.body;

  const result = await query(
    `update venues set
       name = $2, short_name = $3, address = $4, city = $5,
       gate = $6, metro = $7, helpline = $8, helpline_note = $9
     where id = $1
     returning *`,
    [
      req.params.id,
      name || venue.name,
      shortName || venue.short_name,
      address || venue.address,
      city || venue.city,
      gate || venue.gate,
      metro ? JSON.stringify(metro) : venue.metro,
      helpline || venue.helpline,
      helplineNote || venue.helpline_note,
    ],
  );

  res.json({ venue: formatVenue(result.rows[0]) });
});
