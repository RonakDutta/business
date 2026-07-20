import pg from "pg";
import { env } from "./env.js";

/*
  A single pooled connection to Neon. Neon speaks standard Postgres, so the
  node-postgres Pool works as-is; TLS is required, which the ?sslmode=require in
  DATABASE_URL plus the ssl option below satisfy.

  Import `query` for one-off statements and `getClient` when you need a
  transaction (BEGIN / COMMIT / ROLLBACK on the same connection).
*/

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  // Neon terminates TLS; without this pg rejects the self-described cert chain.
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => {
  console.error("[db] idle client error", err);
});

/** Run a parameterised query. Never interpolate values into the text — use $1. */
export function query(text, params) {
  return pool.query(text, params);
}

/** Grab a client for a multi-statement transaction. Remember to release(). */
export function getClient() {
  return pool.connect();
}

/** Cheap liveness probe used by the /health route. */
export async function ping() {
  const { rows } = await pool.query("select 1 as ok");
  return rows[0]?.ok === 1;
}
