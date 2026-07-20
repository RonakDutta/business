import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/asyncHandler.js";

/*
  Auth gates.

  - `authenticate` reads a Bearer token and attaches { id, role } to req.user,
    or 401s. Use on any route that needs to know who's calling.
  - `requireAdmin` runs authenticate first, then 403s non-admins. Use on the
    admin-only mutations (create/edit/delete events, verify payments, etc.).
  - `optionalAuth` attaches req.user when a valid token is present but never
    blocks — handy for endpoints that personalise but also work signed-out.
*/

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export function authenticate(req, _res, next) {
  const token = readToken(req);
  if (!token) return next(new ApiError(401, "Sign in to continue."));
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "Your session has expired. Sign in again."));
  }
}

export function requireAdmin(req, res, next) {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== "admin")
      return next(new ApiError(403, "Admins only."));
    next();
  });
}

export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      /* ignore a bad token on an optional route */
    }
  }
  next();
}
