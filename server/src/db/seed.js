import { pool, query } from "../config/db.js";
import { env } from "../config/env.js";
import { hashPassword } from "../utils/password.js";

async function seedVenue() {
  const existing = await query("select id from venues limit 1");
  if (existing.rows.length > 0) {
    console.log("Venue already exists.");
    return;
  }

  await query(
    `insert into venues (name, short_name, address, city, gate, metro, helpline, is_default)
     values ($1, $2, $3, $4, $5, $6, $7, true)`,
    [
      "Project Otenga , Shaheedi Park",
      "Project Otenga",
      "Gate No. 1, Bahadur Shah Zafar Marg, inside Shaheedi Park",
      "New Delhi 110002",
      "Gate No. 1",
      JSON.stringify({
        station: "ITO",
        exit: "Gate No. 4",
        walk: "5 min walk",
        walkTo: "Project Otenga",
      }),
      "9999658436",
    ],
  );
  console.log("Venue added.");
}

async function seedAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    console.log("Skipping admin: set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    return;
  }

  const passwordHash = await hashPassword(env.adminPassword);
  await query(
    `insert into users (name, email, password_hash, role)
     values ($1, $2, $3, 'admin')
     on conflict (email) do update set role = 'admin'`,
    [env.adminName, env.adminEmail.toLowerCase(), passwordHash],
  );
  console.log(`Admin ready: ${env.adminEmail}`);
}

async function seed() {
  await seedVenue();
  await seedAdmin();
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
