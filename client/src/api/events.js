import { api, toBody } from "./client.js";

/* EVENTS — mirrors server/src/routes/event.routes.js, including the RSVP and
   photo actions nested under an event.

   Create/update accept a plain object; pass an `image` File to upload a cover
   and it's sent as multipart automatically (see toBody). */

export async function list(status) {
  const { events } = await api.get("/events", { params: { status } });
  return events;
}

export async function get(id) {
  const { event } = await api.get(`/events/${id}`);
  return event;
}

export async function create(payload) {
  const { event } = await api.post("/events", toBody(payload));
  return event;
}

export async function update(id, payload) {
  const { event } = await api.patch(`/events/${id}`, toBody(payload));
  return event;
}

export function remove(id) {
  return api.delete(`/events/${id}`);
}

// ---- RSVP on an event ----
export async function rsvp(eventId, paymentRef) {
  const { rsvp } = await api.post(`/events/${eventId}/rsvp`, { paymentRef });
  return rsvp;
}

export function cancelRsvp(eventId) {
  return api.delete(`/events/${eventId}/rsvp`);
}

export async function attendees(eventId) {
  const { attendees } = await api.get(`/events/${eventId}/rsvps`);
  return attendees;
}

// ---- Photos on an event ----
export async function photos(eventId) {
  const { photos } = await api.get(`/events/${eventId}/photos`);
  return photos;
}

export async function addPhoto(eventId, { image, alt, position }) {
  const { photo } = await api.post(
    `/events/${eventId}/photos`,
    toBody({ image, alt, position }),
  );
  return photo;
}
