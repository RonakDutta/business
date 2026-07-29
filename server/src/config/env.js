import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4000,
  isProd: process.env.NODE_ENV === "production",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim()),

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "business4",
  },

  sheets: {
    id: process.env.GOOGLE_SHEETS_ID,
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    contactTab: process.env.GOOGLE_SHEETS_CONTACT_TAB || "Contact",
    rsvpTab: process.env.GOOGLE_SHEETS_RSVP_TAB || "RSVPs",
  },

  adminName: process.env.ADMIN_NAME || "Admin",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};

if (!env.databaseUrl) console.warn("Missing DATABASE_URL in .env");
if (!env.jwtSecret) console.warn("Missing JWT_SECRET in .env");
