import { api } from "./client.js";

/* NEWSLETTER — the footer signup. */

export function subscribe(email) {
  return api.post("/subscribers", { email });
}

export async function list() {
  const { subscribers } = await api.get("/subscribers");
  return subscribers;
}
