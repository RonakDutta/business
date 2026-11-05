const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const { deleteImage } = require("../utils/cloudinary");

router.delete("/:id", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM photos WHERE id = $1 RETURNING public_id", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Photo not found." });
    }

    await deleteImage(result.rows[0].public_id);

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
