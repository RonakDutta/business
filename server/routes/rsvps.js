const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/me", authorization, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.event_date, r.status, r.payment_ref
       FROM rsvps r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = $1 AND r.status = 'going'
       ORDER BY e.event_date DESC`,
      [req.user.id],
    );

    res.json({ rsvps: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
