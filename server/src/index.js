import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

function shutDown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
