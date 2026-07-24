import "dotenv/config";

/*
  One place to read process.env, with light validation so a missing secret
  fails loudly at boot instead of silently at the first request. Everything
  else in the app imports from here rather than touching process.env directly.
*/

const required = ["DATABASE_URL", "JWT_SECRET"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV !== "test") {
  // Not fatal in dev so the server can still boot for a health check, but loud.
  console.warn(
    `[env] Missing required variables: ${missing.join(", ")}. ` +
      `Copy .env.example to .env and fill them in.`,
  );
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",

  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-insecure-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "business4",
  },

  admin: {
    name: process.env.ADMIN_NAME || "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  /*
    Google Sheets (service account). Two ways to supply the key:
      - GOOGLE_APPLICATION_CREDENTIALS = path to the downloaded JSON key file, or
      - GOOGLE_SHEETS_CLIENT_EMAIL + GOOGLE_SHEETS_PRIVATE_KEY (the two fields
        from that JSON). In a .env the private key's newlines are written as
        literal "\n", so we turn them back into real newlines here.
    Either way you also need GOOGLE_SHEETS_ID (from the spreadsheet URL).
  */
  sheets: {
    id: process.env.GOOGLE_SHEETS_ID,
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    contactTab: process.env.GOOGLE_SHEETS_CONTACT_TAB || "Contact",
    rsvpTab: process.env.GOOGLE_SHEETS_RSVP_TAB || "RSVPs",
  },
};
