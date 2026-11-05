const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

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

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM team_members ORDER BY position, created_at");

    const team = result.rows.map((row) => formatMember(row));

    res.json({ team });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/", authorization, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, role, linkedin, position } = req.body;

    if (!name) {
      return res.status(400).json({ error: "A team member needs a name." });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const image = await uploadImage(req.file.buffer, "team");
      imageUrl = image.url;
      imagePublicId = image.publicId;
    }

    const result = await pool.query(
      `INSERT INTO team_members (name, role, linkedin_url, position, image_url, image_public_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        role || "Organiser",
        linkedin || null,
        Number(position) || 0,
        imageUrl,
        imagePublicId,
      ],
    );

    res.status(201).json({ member: formatMember(result.rows[0]) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.patch("/:id", authorization, admin, upload.single("image"), async (req, res) => {
  try {
    const existing = await pool.query("SELECT * FROM team_members WHERE id = $1", [
      req.params.id,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Team member not found." });
    }

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

    let newPosition = member.position;
    if (position !== undefined) {
      newPosition = Number(position);
    }

    const result = await pool.query(
      `UPDATE team_members SET
         name = $2, role = $3, linkedin_url = $4, position = $5,
         image_url = $6, image_public_id = $7
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        name || member.name,
        role || member.role,
        linkedin || member.linkedin_url,
        newPosition,
        imageUrl,
        imagePublicId,
      ],
    );

    res.json({ member: formatMember(result.rows[0]) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.delete("/:id", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM team_members WHERE id = $1 RETURNING image_public_id",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team member not found." });
    }

    await deleteImage(result.rows[0].image_public_id);

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
