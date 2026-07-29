import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";

function formatMember(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    image: row.image_url,
    linkedin: row.linkedin_url,
    position: row.position,
  };
}

// GET /api/team
export const listTeam = asyncHandler(async (req, res) => {
  const result = await query("select * from team_members order by position, created_at");
  res.json({ team: result.rows.map(formatMember) });
});

// POST /api/team  (admin)
export const addMember = asyncHandler(async (req, res) => {
  const { name, role, linkedin, position } = req.body;
  if (!name) throw new ApiError(400, "A team member needs a name.");

  let image = { url: null, publicId: null };
  if (req.file) image = await uploadImage(req.file.buffer, "team");

  const result = await query(
    `insert into team_members (name, role, linkedin_url, position, image_url, image_public_id)
     values ($1, $2, $3, $4, $5, $6)
     returning *`,
    [name, role || "Organiser", linkedin || null, Number(position) || 0, image.url, image.publicId],
  );

  res.status(201).json({ member: formatMember(result.rows[0]) });
});

// PATCH /api/team/:id  (admin)
export const updateMember = asyncHandler(async (req, res) => {
  const existing = await query("select * from team_members where id = $1", [req.params.id]);
  if (existing.rows.length === 0) throw new ApiError(404, "Team member not found.");

  const member = existing.rows[0];
  let imageUrl = member.image_url;
  let imagePublicId = member.image_public_id;

  if (req.file) {
    await deleteImage(imagePublicId);
    const image = await uploadImage(req.file.buffer, "team");
    imageUrl = image.url;
    imagePublicId = image.publicId;
  }

  const { name, role, linkedin, position } = req.body;

  const result = await query(
    `update team_members set
       name = $2, role = $3, linkedin_url = $4, position = $5,
       image_url = $6, image_public_id = $7
     where id = $1
     returning *`,
    [
      req.params.id,
      name || member.name,
      role || member.role,
      linkedin || member.linkedin_url,
      position === undefined ? member.position : Number(position),
      imageUrl,
      imagePublicId,
    ],
  );

  res.json({ member: formatMember(result.rows[0]) });
});

// DELETE /api/team/:id  (admin)
export const deleteMember = asyncHandler(async (req, res) => {
  const result = await query(
    "delete from team_members where id = $1 returning image_public_id",
    [req.params.id],
  );
  if (result.rows.length === 0) throw new ApiError(404, "Team member not found.");

  await deleteImage(result.rows[0].image_public_id);
  res.status(204).end();
});
