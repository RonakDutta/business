import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadBuffer, destroyAsset } from "../config/cloudinary.js";

/* ---------------------------------------------------------------------------
   TEAM (organisers) — frontend client/src/data/team.js. Public list; admin
   create / update / delete, each optionally carrying a portrait upload.
   --------------------------------------------------------------------------- */

const shape = (r) => ({
  id: r.id,
  name: r.name,
  role: r.role,
  image: r.image_url,
  linkedin: r.linkedin_url,
  position: r.position,
});

// GET /api/team
export const listTeam = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    "select * from team_members order by position, created_at",
  );
  res.json({ team: rows.map(shape) });
});

// POST /api/team   (admin) — multipart "image"
export const createMember = asyncHandler(async (req, res) => {
  const { name, role, linkedin, position } = req.body;
  if (!name) throw new ApiError(400, "A team member needs a name.");

  let image = {};
  if (req.file) image = await uploadBuffer(req.file.buffer, "team");

  const { rows } = await query(
    `insert into team_members (name, role, linkedin_url, position, image_url, image_public_id)
     values ($1, coalesce($2,'Organiser'), $3, coalesce($4,0), $5, $6) returning *`,
    [name, role || null, linkedin || null, position, image.url || null, image.publicId || null],
  );
  res.status(201).json({ member: shape(rows[0]) });
});

// PATCH /api/team/:id   (admin)
export const updateMember = asyncHandler(async (req, res) => {
  const existing = await query("select * from team_members where id = $1", [req.params.id]);
  if (!existing.rowCount) throw new ApiError(404, "Team member not found.");

  let imageUrl = existing.rows[0].image_url;
  let imagePublicId = existing.rows[0].image_public_id;
  if (req.file) {
    if (imagePublicId) await destroyAsset(imagePublicId);
    const uploaded = await uploadBuffer(req.file.buffer, "team");
    imageUrl = uploaded.url;
    imagePublicId = uploaded.publicId;
  }

  const b = req.body;
  const { rows } = await query(
    `update team_members set
       name = coalesce($2, name),
       role = coalesce($3, role),
       linkedin_url = coalesce($4, linkedin_url),
       position = coalesce($5, position),
       image_url = $6, image_public_id = $7
     where id = $1 returning *`,
    [req.params.id, b.name || null, b.role || null, b.linkedin || null,
     b.position != null ? Number(b.position) : null, imageUrl, imagePublicId],
  );
  res.json({ member: shape(rows[0]) });
});

// DELETE /api/team/:id   (admin)
export const deleteMember = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "delete from team_members where id = $1 returning image_public_id",
    [req.params.id],
  );
  if (!rows[0]) throw new ApiError(404, "Team member not found.");
  if (rows[0].image_public_id) await destroyAsset(rows[0].image_public_id);
  res.status(204).end();
});
