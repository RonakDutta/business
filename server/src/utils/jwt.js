import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/* Signs and verifies the auth token. Payload is intentionally tiny — id + role
   — so the token stays small and we re-read the user from the db when needed. */

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}
