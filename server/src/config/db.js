import pg from "pg";
import { env } from "./env.js";

// Return DATE columns as plain "YYYY-MM-DD" text instead of a JS Date,
// otherwise timezones shift event dates by a day.
pg.types.setTypeParser(1082, (value) => value);

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
});

export function query(text, params) {
  return pool.query(text, params);
}

export function getClient() {
  return pool.connect();
}

export async function isDatabaseReachable() {
  try {
    await pool.query("select 1");
    return true;
  } catch {
    return false;
  }
}
