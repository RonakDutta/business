import { google } from "googleapis";
import { env } from "./env.js";

/*
  Google Sheets append helper (service account auth).

  Configured when we have a spreadsheet ID AND a key — either a JSON key file
  (GOOGLE_APPLICATION_CREDENTIALS) or the client-email + private-key pair. The
  spreadsheet must be SHARED with the service account's client_email as Editor,
  or every write 403s.

  Everything here is best-effort: appendRow never throws into a request, so a
  Sheets outage can't break a contact submission or an RSVP — the row still
  lands in Postgres regardless.
*/

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export const isSheetsConfigured = Boolean(
  env.sheets.id &&
    (env.sheets.keyFile || (env.sheets.clientEmail && env.sheets.privateKey)),
);

let client = null;
function getSheets() {
  if (client) return client;
  if (!isSheetsConfigured) return null;

  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    ...(env.sheets.keyFile
      ? { keyFile: env.sheets.keyFile }
      : {
          credentials: {
            client_email: env.sheets.clientEmail,
            private_key: env.sheets.privateKey,
          },
        }),
  });

  client = google.sheets({ version: "v4", auth });
  return client;
}

/**
 * Append one row to a tab. `values` is an array of cell values (left to right).
 * Resolves to true if written, false if Sheets isn't configured or the write
 * failed — it never rejects, so callers can fire-and-forget.
 */
export async function appendRow(tabName, values) {
  const sheets = getSheets();
  if (!sheets) return false;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: env.sheets.id,
      range: `${tabName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });
    return true;
  } catch (err) {
    console.error(`[sheets] append to "${tabName}" failed:`, err.message);
    return false;
  }
}
