import { api } from "./client.js";

export function subscribe(email) {
  return api.post("/subscribers", { email });
}
