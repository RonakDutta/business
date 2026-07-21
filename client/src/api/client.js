import axios from "axios";

/* ===========================================================================
   AXIOS CLIENT

   The single configured axios instance every api/* module uses. Nothing in
   the app imports this directly yet — the contexts still run on their
   localStorage stubs — but the whole layer is ready so wiring a context up is
   a one-file change later.

   - baseURL comes from VITE_API_URL, defaulting to "/api" (same origin).
   - A request interceptor attaches the bearer token when we have one.
   - A response interceptor unwraps `response.data`, so callers get the JSON
     body straight, and normalises errors to a plain Error with `.status` and
     the server's message.
   =========================================================================== */

const TOKEN_KEY = "b4:token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function clearToken() {
  setToken(null);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20_000,
});

// Attach the token on every request that has one.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the body; turn axios errors into a clean Error the UI can show.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    const normalised = new Error(message);
    normalised.status = status;
    normalised.data = error.response?.data;
    // A 401 means the token is missing/expired — drop it so we don't keep
    // sending a dead credential. (Redirecting is the caller's job.)
    if (status === 401) clearToken();
    return Promise.reject(normalised);
  },
);

/**
 * Build a request body. If the payload carries a File/Blob (an image upload),
 * send it as multipart FormData; otherwise send plain JSON. Lets the upload
 * endpoints and the JSON endpoints share one calling style.
 */
export function toBody(payload = {}) {
  const hasFile = Object.values(payload).some(
    (v) => v instanceof File || v instanceof Blob,
  );
  if (!hasFile) return payload;

  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value == null) continue;
    // Arrays/objects that aren't files go in as JSON strings (e.g. description).
    if (value instanceof File || value instanceof Blob) form.append(key, value);
    else if (typeof value === "object") form.append(key, JSON.stringify(value));
    else form.append(key, value);
  }
  return form;
}
