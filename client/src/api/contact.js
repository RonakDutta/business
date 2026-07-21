import { api } from "./client.js";

/* CONTACT — the /contact form (today opens a mailto). */

export function submit({ name, email, topic, message }) {
  return api.post("/contact", { name, email, topic, message });
}

export async function list() {
  const { messages } = await api.get("/contact");
  return messages;
}
