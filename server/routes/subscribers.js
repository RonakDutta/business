const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "That email doesn't look right." });
    }

    await pool.query(
      "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email],
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT email, created_at FROM subscribers ORDER BY created_at DESC",
    );

    res.json({ subscribers: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
