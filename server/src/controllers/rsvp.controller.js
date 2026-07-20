import { query, getClient } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";

/* ---------------------------------------------------------------------------
   RSVPS — who's attending which meetup (frontend RsvpContext).

   Creating/cancelling an RSVP also moves the event's attendee_count in the
   same transaction, so the count the site shows never drifts from the rows.
   --------------------------------------------------------------------------- */

// GET /api/rsvps/me   (auth) — the caller's RSVPs
export const listMyRsvps = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select r.event_id, r.status, r.payment_ref, r.created_at, e.event_date
       from rsvps r join events e on e.id = r.event_id
      where r.user_id = $1 and r.status = 'going'
      order by e.event_date desc`,
    [req.user.id],
  );
  res.json({ rsvps: rows });
});

// POST /api/events/:eventId/rsvp   (auth)
export const createRsvp = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const client = await getClient();
  try {
    await client.query("begin");

    const event = await client.query("select id from events where id = $1", [eventId]);
    if (!event.rowCount) throw new ApiError(404, "Event not found.");

    // Upsert to 'going'; only bump the count when the row flips to going.
    const existing = await client.query(
      "select status from rsvps where user_id = $1 and event_id = $2",
      [req.user.id, eventId],
    );
    const wasGoing = existing.rows[0]?.status === "going";

    const { rows } = await client.query(
      `insert into rsvps (user_id, event_id, status, payment_ref)
         values ($1, $2, 'going', $3)
       on conflict (user_id, event_id)
         do update set status = 'going', payment_ref = coalesce($3, rsvps.payment_ref)
       returning *`,
      [req.user.id, eventId, req.body.paymentRef || null],
    );

    if (!wasGoing)
      await client.query(
        "update events set attendee_count = attendee_count + 1 where id = $1",
        [eventId],
      );

    await client.query("commit");
    res.status(201).json({ rsvp: rows[0] });
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
});

// DELETE /api/events/:eventId/rsvp   (auth)
export const cancelRsvp = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const client = await getClient();
  try {
    await client.query("begin");
    const { rows } = await client.query(
      `update rsvps set status = 'cancelled'
        where user_id = $1 and event_id = $2 and status = 'going'
        returning id`,
      [req.user.id, eventId],
    );
    if (rows.length)
      await client.query(
        "update events set attendee_count = greatest(0, attendee_count - 1) where id = $1",
        [eventId],
      );
    await client.query("commit");
    res.status(204).end();
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
});

// GET /api/events/:eventId/rsvps   (admin) — the attendee list
export const listEventRsvps = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select u.id, u.name, u.email, r.payment_ref, r.created_at
       from rsvps r join users u on u.id = r.user_id
      where r.event_id = $1 and r.status = 'going'
      order by r.created_at`,
    [req.params.eventId],
  );
  res.json({ attendees: rows });
});
