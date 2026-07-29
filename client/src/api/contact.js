import { api } from "./client.js";

export function sendMessage(name, email, topic, message) {
  return api.post("/contact", { name, email, topic, message });
}
