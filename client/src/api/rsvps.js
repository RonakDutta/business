import { api } from "./client.js";

/* RSVPS — the caller's own list. Per-event RSVP actions live in api/events.js
   (rsvp / cancelRsvp), matching the server's nested routes. */

export async function mine() {
  const { rsvps } = await api.get("/rsvps/me");
  return rsvps;
}
