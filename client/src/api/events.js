import { api, buildRequestBody } from "./client.js";

export async function getEvents() {
  const data = await api.get("/events");
  return data.events;
}

export async function getEvent(eventId) {
  const data = await api.get(`/events/${eventId}`);
  return data.event;
}

export async function createEvent(fields) {
  const data = await api.post("/events", buildRequestBody(fields));
  return data.event;
}

export async function updateEvent(eventId, fields) {
  const data = await api.patch(`/events/${eventId}`, buildRequestBody(fields));
  return data.event;
}

export function deleteEvent(eventId) {
  return api.delete(`/events/${eventId}`);
}

export function addPhoto(eventId, imageFile) {
  return api.post(`/events/${eventId}/photos`, buildRequestBody({ image: imageFile }));
}

export function joinEvent(eventId, paymentRef) {
  return api.post(`/events/${eventId}/rsvp`, { paymentRef });
}

export function leaveEvent(eventId) {
  return api.delete(`/events/${eventId}/rsvp`);
}
