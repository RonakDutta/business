import { api, setToken, clearToken } from "./client.js";

/* AUTH — mirrors server/src/routes/auth.routes.js.
   register/login return { user, token }; we stash the token so subsequent
   requests are authenticated. */

export async function register({ name, email, password }) {
  const { user, token } = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  setToken(token);
  return user;
}

export async function login({ email, password }) {
  const { user, token } = await api.post("/auth/login", { email, password });
  setToken(token);
  return user;
}

export function logout() {
  clearToken();
}

/** Current user from the token, or null if not signed in / token dead. */
export async function me() {
  try {
    const { user } = await api.get("/auth/me");
    return user;
  } catch {
    return null;
  }
}
