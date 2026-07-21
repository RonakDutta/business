import { api } from "./client.js";

/* SAVED EVENTS — the "Saved" tab, server-backed once wired (today the app uses
   SavedEventsContext + localStorage). */

export async function list() {
  const { savedEventIds } = await api.get("/saved");
  return savedEventIds;
}

export function save(eventId) {
  return api.put(`/saved/${eventId}`);
}

export function unsave(eventId) {
  return api.delete(`/saved/${eventId}`);
}
