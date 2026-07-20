import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

/* ---------------------------------------------------------------------------
   AUTH — register, login, me.

   Passwords are bcrypt-hashed; the client gets a JWT it sends as
   `Authorization: Bearer <token>`. This replaces the frontend's localStorage
   auth stub (client/src/context/AuthContext.jsx) when the two are wired up.
   --------------------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shape a users row for the client — never leak password_hash. */
const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.created_at,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!name) throw new ApiError(400, "Tell us your name.");
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "That email doesn't look right.");
  if (password.length < 6)
    throw new ApiError(400, "Password needs to be at least 6 characters.");

  const exists = await query("select 1 from users where email = $1", [email]);
  if (exists.rowCount) throw new ApiError(409, "That email is already registered.");

  const hash = await hashPassword(password);
  const { rows } = await query(
    `insert into users (name, email, password_hash)
     values ($1, $2, $3) returning *`,
    [name, email, hash],
  );

  const user = rows[0];
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const { rows } = await query("select * from users where email = $1", [email]);
  const user = rows[0];
  // Same message either way, so we don't reveal which emails exist.
  if (!user || !(await verifyPassword(password, user.password_hash)))
    throw new ApiError(401, "Wrong email or password.");

  res.json({ user: publicUser(user), token: signToken(user) });
});

// GET /api/auth/me   (requires auth)
export const me = asyncHandler(async (req, res) => {
  const { rows } = await query("select * from users where id = $1", [req.user.id]);
  if (!rows[0]) throw new ApiError(404, "Account not found.");
  res.json({ user: publicUser(rows[0]) });
});
