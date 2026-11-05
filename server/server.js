const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./db");
const { isCloudinaryConfigured } = require("./utils/cloudinary");
const { isSheetsConfigured } = require("./utils/sheets");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ name: "Business 4.0 API" });
});

app.get("/api/health", async (req, res) => {
  let databaseOk = true;

  try {
    await pool.query("SELECT 1");
  } catch (err) {
    databaseOk = false;
  }

  res.json({
    ok: true,
    database: databaseOk,
    cloudinary: isCloudinaryConfigured,
    sheets: isSheetsConfigured,
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/rsvps", require("./routes/rsvps"));
app.use("/api/saved", require("./routes/saved"));
app.use("/api/photos", require("./routes/photos"));
app.use("/api/team", require("./routes/team"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/subscribers", require("./routes/subscribers"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/venue", require("./routes/venue"));

app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "That image is too large." });
  }

  const status = err.status || 500;

  if (status >= 500) {
    console.error(err.message);
  }

  res.status(status).json({ error: err.message || "Something went wrong." });
});

if (!process.env.DATABASE_URL) console.warn("Missing DATABASE_URL in .env");
if (!process.env.JWT_SECRET) console.warn("Missing JWT_SECRET in .env");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutDown = () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
