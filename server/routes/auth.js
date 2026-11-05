const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool = require("../db");
const authorization = require("../middleware/authorization");
const jwtGenerator = require("../utils/jwtGenerator");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!name) {
      return res.status(400).json({ error: "Tell us your name." });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "That email doesn't look right." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password needs at least 6 characters." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "That email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, passwordHash],
    );

    const user = newUser.rows[0];
    const token = jwtGenerator(user);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That email is already registered." });
    }

    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Wrong email or password." });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Wrong email or password." });
    }

    const token = jwtGenerator(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/me", authorization, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Account not found." });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
