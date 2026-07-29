import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function readToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
