const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");

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

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM venues ORDER BY is_default DESC, created_at LIMIT 1",
    );

    if (result.rows.length === 0) {
      return res.json({ venue: null });
    }

    res.json({ venue: formatVenue(result.rows[0]) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.patch("/:id", authorization, admin, async (req, res) => {
  try {
    const existing = await pool.query("SELECT * FROM venues WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found." });
    }

    const venue = existing.rows[0];
    const { name, shortName, address, city, gate, metro, helpline, helplineNote } = req.body;

    let newMetro = venue.metro;
    if (metro) {
      newMetro = JSON.stringify(metro);
    }

    const result = await pool.query(
      `UPDATE venues SET
         name = $2, short_name = $3, address = $4, city = $5,
         gate = $6, metro = $7, helpline = $8, helpline_note = $9
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        name || venue.name,
        shortName || venue.short_name,
        address || venue.address,
        city || venue.city,
        gate || venue.gate,
        newMetro,
        helpline || venue.helpline,
        helplineNote || venue.helpline_note,
      ],
    );

    res.json({ venue: formatVenue(result.rows[0]) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
