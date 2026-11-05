const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function migrate() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await pool.query(sql);
    console.log("Tables are ready.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
