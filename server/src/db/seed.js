import { pool, query } from "../config/db.js";
import { env } from "../config/env.js";
import { hashPassword } from "../utils/password.js";

/*
  Minimal seed so a fresh database is usable:
   - the default venue (Project Otenga), mirrored from client/src/data/venue.js
   - a first admin account from ADMIN_* env vars, so someone can reach the
     admin endpoints.

  It does NOT seed events/photos — those are the real content the admin panel
  will create. Extend this with the SEED_MEETUPS list from the frontend if you
  want sample data. Safe to re-run: everything upserts on a natural key.

  Run with `npm run db:seed` (after `npm run db:migrate`).
*/

async function seedVenue() {
  await query(
    `insert into venues (name, short_name, address, city, gate, metro, helpline, helpline_note, is_default)
     values ($1,$2,$3,$4,$5,$6,$7,$8,true)
     on conflict do nothing`,
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
      "For directions on the day only.",
    ],
  );
  console.log("[seed] venue ready");
}

async function seedAdmin() {
  if (!env.admin.email || !env.admin.password) {
    console.log("[seed] skipping admin — set ADMIN_EMAIL and ADMIN_PASSWORD");
    return;
  }
  const hash = await hashPassword(env.admin.password);
  await query(
    `insert into users (name, email, password_hash, role)
     values ($1, $2, $3, 'admin')
     on conflict (email) do update set role = 'admin'`,
    [env.admin.name, env.admin.email.toLowerCase(), hash],
  );
  console.log(`[seed] admin ready: ${env.admin.email}`);
}

async function seed() {
  await seedVenue();
  await seedAdmin();
}

seed()
  .catch((err) => {
    console.error("[seed] failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
