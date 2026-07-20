import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

/* Password hashing lives here so the cost factor is set in exactly one place. */

export function hashPassword(plain) {
  return bcrypt.hash(plain, env.bcryptRounds);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
