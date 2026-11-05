const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    const result = await pool.query("SELECT event_id FROM saved_events WHERE user_id = $1", [
      req.user.id,
    ]);

    const savedEventIds = result.rows.map((row) => row.event_id);

    res.json({ savedEventIds });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.put("/:eventId", authorization, async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2) ON CONFLICT (user_id, event_id) DO NOTHING",
      [req.user.id, req.params.eventId],
    );

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.delete("/:eventId", authorization, async (req, res) => {
  try {
    await pool.query("DELETE FROM saved_events WHERE user_id = $1 AND event_id = $2", [
      req.user.id,
      req.params.eventId,
    ]);

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
