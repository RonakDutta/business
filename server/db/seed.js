const bcrypt = require("bcryptjs");
const pool = require("../db");

async function seedVenue() {
  const existing = await pool.query("SELECT id FROM venues LIMIT 1");

  if (existing.rows.length > 0) {
    console.log("Venue already exists.");
    return;
  }

  const metro = {
    station: "ITO",
    exit: "Gate No. 4",
    walk: "5 min walk",
    walkTo: "Project Otenga",
  };

  await pool.query(
    `INSERT INTO venues (name, short_name, address, city, gate, metro, helpline, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
    [
      "Project Otenga , Shaheedi Park",
      "Project Otenga",
      "Gate No. 1, Bahadur Shah Zafar Marg, inside Shaheedi Park",
      "New Delhi 110002",
      "Gate No. 1",
      JSON.stringify(metro),
      "9999658436",
    ],
  );

  console.log("Venue added.");
}

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME || "Admin";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin: set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET role = 'admin'`,
    [adminName, adminEmail.toLowerCase(), passwordHash],
  );

  console.log(`Admin ready: ${adminEmail}`);
}

async function seed() {
  try {
    await seedVenue();
    await seedAdmin();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
