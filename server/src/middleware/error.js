import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

export function handleErrors(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message || "Something went wrong.";

  if (error.code === "23505") {
    status = 409;
    message = "That already exists.";
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "That image is too large.";
  }

  if (status >= 500) console.error(error);

  res.status(status).json({
    error: message,
    stack: env.isProd ? undefined : error.stack,
  });
}
