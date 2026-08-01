// Express 4 does not catch errors thrown inside async functions, so every
// controller is wrapped in this and errors are passed to the error middleware.
export const asyncHandler = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next);
};

// Throw this when you want a specific HTTP status, e.g. new ApiError(404, "...")
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
