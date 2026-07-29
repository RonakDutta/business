import axios from "axios";

const TOKEN_KEY = "b4:token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Send the login token with every request, if we have one.
api.interceptors.request.use((request) => {
  const token = getToken();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

// Give back just the data, and turn server errors into a plain Error
// with the message the server sent.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || "Something went wrong.";

    if (status === 401) clearToken();

    return Promise.reject(new Error(message));
  },
);

// Images have to be sent as FormData; plain data can go as JSON.
export function buildRequestBody(fields) {
  const hasFile = Object.values(fields).some((value) => value instanceof Blob);
  if (!hasFile) return fields;

  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (value instanceof Blob) formData.append(key, value);
    else if (typeof value === "object") formData.append(key, JSON.stringify(value));
    else formData.append(key, value);
  }
  return formData;
}
