import { api } from "./client.js";

// The events the signed-in member has said they are coming to.
export async function getMyRsvps() {
  const data = await api.get("/rsvps/me");
  return data.rsvps;
}
