const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const { addRowToSheet, contactTab } = require("../utils/sheets");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const message = (req.body.message || "").trim();
    const topic = (req.body.topic || "").trim() || null;

    if (!name) {
      return res.status(400).json({ error: "We'd like to know who's writing." });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "That email doesn't look right." });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: "Tell us a bit more." });
    }

    await pool.query(
      "INSERT INTO contact_messages (name, email, topic, message) VALUES ($1, $2, $3, $4)",
      [name, email, topic, message],
    );

    addRowToSheet(contactTab, [new Date().toISOString(), name, email, topic || "", message]);

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");

    res.json({ messages: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
