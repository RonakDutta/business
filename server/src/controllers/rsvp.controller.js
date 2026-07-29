import { query, getClient } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { addRowToSheet } from "../config/sheets.js";
import { env } from "../config/env.js";

// Copies one RSVP into the Google Sheet the organisers read.
async function copyRsvpToSheet(userId, eventId, paymentRef) {
  const details = await query(
    `select u.name, u.email, e.title, e.event_date, e.entry_fee
     from users u, events e
     where u.id = $1 and e.id = $2`,
    [userId, eventId],
  );
  if (details.rows.length === 0) return;

  const info = details.rows[0];
  let amount = info.entry_fee === 0 ? "Free" : `₹${info.entry_fee}`;
  let proofUrl = "";

  if (paymentRef) {
    const payment = await query(
      "select proof_url, amount from payments where payment_ref = $1",
      [paymentRef],
    );
    if (payment.rows.length > 0) {
      proofUrl = payment.rows[0].proof_url || "";
      if (payment.rows[0].amount !== null) amount = `₹${payment.rows[0].amount}`;
    }
  }

  await addRowToSheet(env.sheets.rsvpTab, [
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

// GET /api/rsvps/me
export const listMyRsvps = asyncHandler(async (req, res) => {
  const result = await query(
    `select e.event_date, r.status, r.payment_ref
     from rsvps r
     join events e on e.id = r.event_id
     where r.user_id = $1 and r.status = 'going'
     order by e.event_date desc`,
    [req.user.id],
  );

  res.json({ rsvps: result.rows });
});

// POST /api/events/:eventId/rsvp
// Saving the RSVP and raising the attendee count must both happen or neither,
// so they run inside one database transaction.
export const createRsvp = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const paymentRef = req.body.paymentRef || null;

  const client = await getClient();
  let wasAlreadyGoing = false;

  try {
    await client.query("begin");

    const event = await client.query("select id from events where id = $1", [eventId]);
    if (event.rows.length === 0) throw new ApiError(404, "Event not found.");

    const existing = await client.query(
      "select status from rsvps where user_id = $1 and event_id = $2",
      [userId, eventId],
    );
    wasAlreadyGoing = existing.rows[0]?.status === "going";

    await client.query(
      `insert into rsvps (user_id, event_id, status, payment_ref)
       values ($1, $2, 'going', $3)
       on conflict (user_id, event_id)
       do update set status = 'going', payment_ref = coalesce($3, rsvps.payment_ref)`,
      [userId, eventId, paymentRef],
    );

    if (!wasAlreadyGoing) {
      await client.query(
        "update events set attendee_count = attendee_count + 1 where id = $1",
        [eventId],
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  res.status(201).json({ ok: true });

  // Only a brand new booking goes to the sheet, so re-confirming cannot
  // add the same person twice.
  if (!wasAlreadyGoing) {
    copyRsvpToSheet(userId, eventId, paymentRef).catch((error) =>
      console.error("Could not copy RSVP to the sheet:", error.message),
    );
  }
});

// DELETE /api/events/:eventId/rsvp
export const cancelRsvp = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const client = await getClient();
  try {
    await client.query("begin");

    const result = await client.query(
      `update rsvps set status = 'cancelled'
       where user_id = $1 and event_id = $2 and status = 'going'
       returning id`,
      [req.user.id, eventId],
    );

    if (result.rows.length > 0) {
      await client.query(
        "update events set attendee_count = greatest(0, attendee_count - 1) where id = $1",
        [eventId],
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  res.status(204).end();
});

// GET /api/events/:eventId/rsvps  (admin)
export const listEventAttendees = asyncHandler(async (req, res) => {
  const result = await query(
    `select u.id, u.name, u.email, r.payment_ref, r.created_at
     from rsvps r
     join users u on u.id = r.user_id
     where r.event_id = $1 and r.status = 'going'
     order by r.created_at`,
    [req.params.eventId],
  );

  res.json({ attendees: result.rows });
});
