import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "../config/db.js";

/*
  Applies schema.sql to the database in DATABASE_URL. Idempotent — every
  statement is CREATE ... IF NOT EXISTS, so this doubles as "make sure the
  tables exist". Run with `npm run db:migrate`.

  This is deliberately a plain SQL runner, not a full migration framework:
  there's one schema file and it's safe to re-run. Reach for node-pg-migrate
  or Prisma once you need ordered, reversible migrations.
*/

const here = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = await readFile(join(here, "schema.sql"), "utf8");
  console.log("[migrate] applying schema.sql ...");
  await pool.query(sql);
  console.log("[migrate] done.");
}

migrate()
  .catch((err) => {
    console.error("[migrate] failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
