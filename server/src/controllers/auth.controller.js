import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { hashPassword, checkPassword } from "../utils/password.js";
import { createToken } from "../utils/jwt.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The password hash must never leave the server.
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!name) throw new ApiError(400, "Tell us your name.");
  if (!EMAIL_PATTERN.test(email)) throw new ApiError(400, "That email doesn't look right.");
  if (password.length < 6) throw new ApiError(400, "Password needs at least 6 characters.");

  const existing = await query("select id from users where email = $1", [email]);
  if (existing.rows.length > 0) throw new ApiError(409, "That email is already registered.");

  const passwordHash = await hashPassword(password);
  const result = await query(
    "insert into users (name, email, password_hash) values ($1, $2, $3) returning *",
    [name, email, passwordHash],
  );
  const user = result.rows[0];

  res.status(201).json({ user: publicUser(user), token: createToken(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const result = await query("select * from users where email = $1", [email]);
  const user = result.rows[0];

  // Same message either way so nobody can find out which emails exist.
  if (!user) throw new ApiError(401, "Wrong email or password.");

  const passwordIsCorrect = await checkPassword(password, user.password_hash);
  if (!passwordIsCorrect) throw new ApiError(401, "Wrong email or password.");

  res.json({ user: publicUser(user), token: createToken(user) });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const result = await query("select * from users where id = $1", [req.user.id]);
  if (result.rows.length === 0) throw new ApiError(404, "Account not found.");

  res.json({ user: publicUser(result.rows[0]) });
});
