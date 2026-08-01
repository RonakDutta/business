import { api } from "./client.js";

export async function getVenue() {
  const data = await api.get("/venue");
  return data.venue;
}
