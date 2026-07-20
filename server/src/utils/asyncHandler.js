/*
  Wraps an async route handler so a rejected promise is forwarded to Express's
  error middleware instead of crashing the process. Every controller is wrapped
  in this, so controllers can just `throw` and let middleware/error.js respond.
*/
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** A thrown ApiError carries an HTTP status the error handler will honour. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
