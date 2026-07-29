import { api, saveToken, clearToken } from "./client.js";

export async function register(name, email, password) {
  const data = await api.post("/auth/register", { name, email, password });
  saveToken(data.token);
  return data.user;
}

export async function login(email, password) {
  const data = await api.post("/auth/login", { email, password });
  saveToken(data.token);
  return data.user;
}

export function logout() {
  clearToken();
}

// Used on page load to find out who is signed in.
export async function getCurrentUser() {
  const data = await api.get("/auth/me");
  return data.user;
}
