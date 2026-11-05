const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");
const { uploadImage } = require("../utils/cloudinary");

router.post("/", optionalAuth, upload.single("proof"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Attach your payment screenshot." });
    }

    const { eventId, payerName, payerEmail, paymentRef, amount } = req.body;

    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }

    const image = await uploadImage(req.file.buffer, "payments");

    const result = await pool.query(
      `INSERT INTO payments
         (event_id, user_id, payer_name, payer_email, payment_ref, amount, proof_url, proof_public_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, status, created_at`,
      [
        eventId || null,
        userId,
        payerName || null,
        payerEmail || null,
        paymentRef || null,
        Number(amount) || null,
        image.url,
        image.publicId,
      ],
    );

    res.status(201).json({ payment: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/", authorization, admin, async (req, res) => {
  try {
    const status = req.query.status;

    let result;

    if (status) {
      result = await pool.query(
        "SELECT * FROM payments WHERE status = $1 ORDER BY created_at DESC",
        [status],
      );
    } else {
      result = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    }

    res.json({ payments: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.patch("/:id", authorization, admin, async (req, res) => {
  try {
    const status = req.body.status;

    if (status !== "verified" && status !== "rejected") {
      return res.status(400).json({ error: "Status must be 'verified' or 'rejected'." });
    }

    const result = await pool.query(
      "UPDATE payments SET status = $2 WHERE id = $1 RETURNING id, status",
      [req.params.id, status],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found." });
    }

    res.json({ payment: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
