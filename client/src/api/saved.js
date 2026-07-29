import { api } from "./client.js";

export async function getSavedEventIds() {
  const data = await api.get("/saved");
  return data.savedEventIds;
}

export function saveEvent(eventId) {
  return api.put(`/saved/${eventId}`);
}

export function unsaveEvent(eventId) {
  return api.delete(`/saved/${eventId}`);
}
