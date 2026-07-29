import { readToken } from "../utils/jwt.js";
import { ApiError } from "../utils/asyncHandler.js";

function getTokenFromRequest(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.replace("Bearer ", "");
}

// Blocks the request unless a valid token is sent, and remembers who it is.
export function requireLogin(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) return next(new ApiError(401, "Sign in to continue."));

  try {
    const user = readToken(token);
    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    next(new ApiError(401, "Your session has expired. Sign in again."));
  }
}

// Same as above, then blocks anyone who is not an admin.
export function requireAdmin(req, res, next) {
  requireLogin(req, res, (error) => {
    if (error) return next(error);
    if (req.user.role !== "admin") return next(new ApiError(403, "Admins only."));
    next();
  });
}

// Remembers the user if a token was sent, but never blocks the request.
export function optionalLogin(req, res, next) {
  const token = getTokenFromRequest(req);
  if (token) {
    try {
      const user = readToken(token);
      req.user = { id: user.id, role: user.role };
    } catch {
      // ignore a bad token here
    }
  }
  next();
}
