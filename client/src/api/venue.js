import { api } from "./client.js";

/* VENUE — the meetup location. Public get; admin update. */

export async function get() {
  const { venue } = await api.get("/venue");
  return venue;
}

export async function update(id, payload) {
  const { venue } = await api.patch(`/venue/${id}`, payload);
  return venue;
}
