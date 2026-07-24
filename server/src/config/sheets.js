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

// Header row written when we auto-create a known tab, keyed by the configured
// tab name so it works even if you rename the tab via the env vars.
const HEADERS = {
  [env.sheets.contactTab]: ["Timestamp", "Name", "Email", "Topic", "Message"],
  [env.sheets.rsvpTab]: [
    "Timestamp", "Name", "Email", "Event", "Date", "Amount", "Reference", "Proof",
  ],
};

// Tabs we've confirmed/created this process, so it's one metadata check each.
const ensured = new Set();

/*
  Make sure a tab exists before appending. If it's missing we create it (with a
  header row when we know the shape) — so a tab-name mismatch, or a brand-new
  spreadsheet, self-heals instead of silently dropping rows.
*/
async function ensureTab(sheets, tabName) {
  if (ensured.has(tabName)) return;

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: env.sheets.id,
    fields: "sheets.properties.title",
  });
  const titles = (meta.data.sheets || []).map((s) => s.properties.title);

  if (!titles.includes(tabName)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: env.sheets.id,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      },
    });
    const header = HEADERS[tabName];
    if (header) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: env.sheets.id,
        range: `${tabName}!A1`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [header] },
      });
    }
    console.log(`[sheets] created missing tab "${tabName}"`);
  }

  ensured.add(tabName);
}

/**
 * Append one row to a tab (creating the tab if needed). `values` is an array of
 * cell values, left to right. Resolves to true if written, false if Sheets
 * isn't configured or the write failed — it never rejects, so callers can
 * fire-and-forget.
 */
export async function appendRow(tabName, values) {
  const sheets = getSheets();
  if (!sheets) return false;

  try {
    await ensureTab(sheets, tabName);
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
