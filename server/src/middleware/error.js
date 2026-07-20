import { env } from "../config/env.js";

/*
  Central error handler — the last middleware Express calls. Controllers throw
  (via asyncHandler) and end up here, so responses stay consistent.

  Known cases get friendly statuses:
   - ApiError carries its own status.
   - Postgres unique-violation (23505) → 409.
   - Multer file-size limit → 413.
  Everything else is a 500, with the stack only in development.
*/
export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || "Something went wrong.";

  if (err.code === "23505") {
    status = 409;
    message = "That already exists.";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "That image is too large.";
  }

  if (status >= 500) console.error("[error]", err);

  res.status(status).json({
    error: message,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}
