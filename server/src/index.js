import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

/*
  Entry point. Boots the HTTP server and wires up graceful shutdown so the
  Postgres pool drains cleanly on Ctrl-C or a platform SIGTERM.
*/

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`[server] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  console.log(`[server] health check: http://localhost:${env.port}/api/health`);
});

async function shutdown(signal) {
  console.log(`\n[server] ${signal} received, shutting down ...`);
  server.close(async () => {
    await pool.end().catch(() => {});
    process.exit(0);
  });
  // Don't hang forever if a connection is stuck.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
