import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

const folder = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = await readFile(join(folder, "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Tables are ready.");
}

migrate()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
