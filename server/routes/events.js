const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const { addRowToSheet, rsvpTab } = require("../utils/sheets");

const DEFAULT_TITLE = "Business4.0 Meetup (Entry Fee Applicable)";

function isPastEvent(eventDate) {
  const endTime = new Date(`${eventDate}T13:00:00+05:30`);
  return endTime.getTime() < Date.now();
}

function formatEvent(row, photos, attendees) {
  const past = isPastEvent(row.event_date);

  let status = "upcoming";
  if (row.cancelled) {
    status = "cancelled";
  } else if (past) {
    status = "past";
  }

  return {
    id: row.id,
    date: row.event_date,
    title: row.title,
    entryFee: row.entry_fee,
    description: row.description || [],
    image: row.image_url,
    attendeeCount: row.attendee_count,
    cancelled: row.cancelled,
    isPast: past,
    status: status,
    photos: photos || [],
    attendees: attendees || [],
  };
}

function toParagraphs(description) {
  if (description === undefined || description === null) {
    return null;
  }

  if (Array.isArray(description)) {
    return description;
  }

  let parsed = null;

  try {
    parsed = JSON.parse(description);
  } catch (err) {
    parsed = null;
  }

  if (Array.isArray(parsed)) {
    return parsed;
  }

  const lines = String(description).split("\n");
  const paragraphs = [];

  for (const line of lines) {
    const text = line.trim();
    if (text.length > 0) {
      paragraphs.push(text);
    }
  }

  return paragraphs;
}

async function copyRsvpToSheet(userId, eventId, paymentRef) {
  const details = await pool.query(
    `SELECT u.name, u.email, e.title, e.event_date, e.entry_fee
     FROM users u, events e
     WHERE u.id = $1 AND e.id = $2`,
    [userId, eventId],
  );

  if (details.rows.length === 0) {
    return;
  }

  const info = details.rows[0];

  let amount = `₹${info.entry_fee}`;
  if (info.entry_fee === 0) {
    amount = "Free";
  }

  let proofUrl = "";

  if (paymentRef) {
    const payment = await pool.query(
      "SELECT proof_url, amount FROM payments WHERE payment_ref = $1",
      [paymentRef],
    );

    if (payment.rows.length > 0) {
      proofUrl = payment.rows[0].proof_url || "";

      if (payment.rows[0].amount !== null) {
        amount = `₹${payment.rows[0].amount}`;
      }
    }
  }

  await addRowToSheet(rsvpTab, [
    new Date().toISOString(),
    info.name,
    info.email,
    info.title,
    info.event_date,
    amount,
    paymentRef || "",
    proofUrl,
  ]);
}

router.get("/", async (req, res) => {
  try {
    const eventRows = await pool.query("SELECT * FROM events ORDER BY event_date DESC");

    const photoRows = await pool.query(
      "SELECT event_id, url FROM photos ORDER BY position, created_at",
    );

    const attendeeRows = await pool.query(
      `SELECT r.event_id, u.id, u.name
       FROM rsvps r
       JOIN users u ON u.id = r.user_id
       WHERE r.status = 'going'
       ORDER BY r.created_at`,
    );

    const events = [];

    for (const row of eventRows.rows) {
      const photos = [];
      for (const photo of photoRows.rows) {
        if (photo.event_id === row.id) {
          photos.push(photo.url);
        }
      }

      const attendees = [];
      for (const attendee of attendeeRows.rows) {
        if (attendee.event_id === row.id) {
          attendees.push({ id: attendee.id, name: attendee.name });
        }
      }

      events.push(formatEvent(row, photos, attendees));
    }

    res.json({ events });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const eventRows = await pool.query("SELECT * FROM events WHERE id = $1", [req.params.id]);

    if (eventRows.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    const photoRows = await pool.query(
      "SELECT url FROM photos WHERE event_id = $1 ORDER BY position, created_at",
      [req.params.id],
    );

    const attendeeRows = await pool.query(
      `SELECT u.id, u.name
       FROM rsvps r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1 AND r.status = 'going'
       ORDER BY r.created_at`,
      [req.params.id],
    );

    const photos = photoRows.rows.map((photo) => photo.url);
    const attendees = attendeeRows.rows.map((row) => ({ id: row.id, name: row.name }));

    res.json({ event: formatEvent(eventRows.rows[0], photos, attendees) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/", authorization, admin, upload.single("image"), async (req, res) => {
  try {
    const { date, title, entryFee, description, attendeeCount } = req.body;

    if (!date) {
      return res.status(400).json({ error: "A meetup needs a date." });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const image = await uploadImage(req.file.buffer, "events");
      imageUrl = image.url;
      imagePublicId = image.publicId;
    }

    const newEvent = await pool.query(
      `INSERT INTO events
         (event_date, title, entry_fee, description, attendee_count, image_url, image_public_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        date,
        (title || "").trim() || DEFAULT_TITLE,
        Number(entryFee) || 0,
        toParagraphs(description),
        Number(attendeeCount) || 0,
        imageUrl,
        imagePublicId,
      ],
    );

    res.status(201).json({ event: formatEvent(newEvent.rows[0]) });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That already exists." });
    }

    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.patch("/:id", authorization, admin, upload.single("image"), async (req, res) => {
  try {
    const existing = await pool.query("SELECT * FROM events WHERE id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    const event = existing.rows[0];

    let imageUrl = event.image_url;
    let imagePublicId = event.image_public_id;

    if (req.file) {
      await deleteImage(imagePublicId);
      const image = await uploadImage(req.file.buffer, "events");
      imageUrl = image.url;
      imagePublicId = image.publicId;
    }

    const { date, title, entryFee, description, attendeeCount, cancelled } = req.body;

    let newEntryFee = event.entry_fee;
    if (entryFee !== undefined) {
      newEntryFee = Number(entryFee);
    }

    let newAttendeeCount = event.attendee_count;
    if (attendeeCount !== undefined) {
      newAttendeeCount = Number(attendeeCount);
    }

    let newCancelled = event.cancelled;
    if (cancelled !== undefined) {
      newCancelled = cancelled === true || cancelled === "true";
    }

    const result = await pool.query(
      `UPDATE events SET
         event_date = $2,
         title = $3,
         entry_fee = $4,
         description = $5,
         attendee_count = $6,
         cancelled = $7,
         image_url = $8,
         image_public_id = $9,
         updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        date || event.event_date,
        (title || "").trim() || event.title,
        newEntryFee,
        toParagraphs(description) || event.description,
        newAttendeeCount,
        newCancelled,
        imageUrl,
        imagePublicId,
      ],
    );

    res.json({ event: formatEvent(result.rows[0]) });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That already exists." });
    }

    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.delete("/:id", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING image_public_id",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    await deleteImage(result.rows[0].image_public_id);

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/:eventId/rsvp", authorization, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const paymentRef = req.body.paymentRef || null;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const event = await client.query("SELECT id FROM events WHERE id = $1", [eventId]);

    if (event.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Event not found." });
    }

    const existing = await client.query(
      "SELECT status FROM rsvps WHERE user_id = $1 AND event_id = $2",
      [userId, eventId],
    );

    let wasAlreadyGoing = false;
    if (existing.rows.length > 0 && existing.rows[0].status === "going") {
      wasAlreadyGoing = true;
    }

    await client.query(
      `INSERT INTO rsvps (user_id, event_id, status, payment_ref)
       VALUES ($1, $2, 'going', $3)
       ON CONFLICT (user_id, event_id)
       DO UPDATE SET status = 'going', payment_ref = COALESCE($3, rsvps.payment_ref)`,
      [userId, eventId, paymentRef],
    );

    if (!wasAlreadyGoing) {
      await client.query(
        "UPDATE events SET attendee_count = attendee_count + 1 WHERE id = $1",
        [eventId],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ ok: true });

    if (!wasAlreadyGoing) {
      copyRsvpToSheet(userId, eventId, paymentRef).catch((err) => {
        console.error("Could not copy RSVP to the sheet:", err.message);
      });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  } finally {
    client.release();
  }
});

router.delete("/:eventId/rsvp", authorization, async (req, res) => {
  const eventId = req.params.eventId;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE rsvps SET status = 'cancelled'
       WHERE user_id = $1 AND event_id = $2 AND status = 'going'
       RETURNING id`,
      [req.user.id, eventId],
    );

    if (result.rows.length > 0) {
      await client.query(
        "UPDATE events SET attendee_count = GREATEST(0, attendee_count - 1) WHERE id = $1",
        [eventId],
      );
    }

    await client.query("COMMIT");

    res.status(204).end();
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  } finally {
    client.release();
  }
});

router.get("/:eventId/rsvps", authorization, admin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, r.payment_ref, r.created_at
       FROM rsvps r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1 AND r.status = 'going'
       ORDER BY r.created_at`,
      [req.params.eventId],
    );

    res.json({ attendees: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/:eventId/photos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, url, alt, position FROM photos WHERE event_id = $1 ORDER BY position, created_at",
      [req.params.eventId],
    );

    res.json({ photos: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/:eventId/photos", authorization, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Attach an image to upload." });
    }

    const event = await pool.query("SELECT id FROM events WHERE id = $1", [req.params.eventId]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    const image = await uploadImage(req.file.buffer, `gallery/${req.params.eventId}`);

    const result = await pool.query(
      `INSERT INTO photos (event_id, url, public_id, alt, position)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, url, alt, position`,
      [
        req.params.eventId,
        image.url,
        image.publicId,
        req.body.alt || null,
        Number(req.body.position) || 0,
      ],
    );

    res.status(201).json({ photo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
