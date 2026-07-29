import { google } from "googleapis";
import { env } from "./env.js";

export const isSheetsConfigured = Boolean(
  env.sheets.id && (env.sheets.keyFile || env.sheets.clientEmail),
);

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    keyFile: env.sheets.keyFile,
    credentials: env.sheets.keyFile
      ? undefined
      : {
          client_email: env.sheets.clientEmail,
          private_key: env.sheets.privateKey,
        },
  });
  return google.sheets({ version: "v4", auth });
}

export async function getTabNames() {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.get({
    spreadsheetId: env.sheets.id,
    fields: "sheets.properties.title",
  });
  return response.data.sheets.map((sheet) => sheet.properties.title);
}

async function createTabIfMissing(sheets, tabName) {
  const tabNames = await getTabNames();
  if (tabNames.includes(tabName)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: env.sheets.id,
    requestBody: {
      requests: [{ addSheet: { properties: { title: tabName } } }],
    },
  });
}

// Adds one row to the bottom of a tab. Never throws: if Google fails we log it
// and carry on, because the data is already saved in the database.
export async function addRowToSheet(tabName, row) {
  if (!isSheetsConfigured) return false;

  try {
    const sheets = getSheetsClient();
    await createTabIfMissing(sheets, tabName);

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.sheets.id,
      range: `${tabName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    console.log(`Added a row to the "${tabName}" sheet`);
    return true;
  } catch (error) {
    const details = error.response?.data?.error?.message || "";
    console.error(`Could not write to "${tabName}":`, error.message, details);
    return false;
  }
}
