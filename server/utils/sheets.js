const { google } = require("googleapis");

const sheetId = process.env.GOOGLE_SHEETS_ID;
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n");

const contactTab = process.env.GOOGLE_SHEETS_CONTACT_TAB || "Contact";
const rsvpTab = process.env.GOOGLE_SHEETS_RSVP_TAB || "RSVPs";

const isSheetsConfigured = Boolean(sheetId && (keyFile || clientEmail));

function getSheetsClient() {
  let auth;

  if (keyFile) {
    auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      keyFile: keyFile,
    });
  } else {
    auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  return google.sheets({ version: "v4", auth: auth });
}

async function getTabNames() {
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });

  return response.data.sheets.map((sheet) => sheet.properties.title);
}

async function addRowToSheet(tabName, row) {
  if (!isSheetsConfigured) {
    return false;
  }

  try {
    const sheets = getSheetsClient();

    const tabNames = await getTabNames();

    if (!tabNames.includes(tabName)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: tabName } } }],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    console.log(`Added a row to the "${tabName}" sheet`);
    return true;
  } catch (err) {
    let details = "";

    if (err.response && err.response.data && err.response.data.error) {
      details = err.response.data.error.message;
    }

    console.error(`Could not write to "${tabName}":`, err.message, details);
    return false;
  }
}

module.exports = {
  sheetId,
  contactTab,
  rsvpTab,
  isSheetsConfigured,
  getTabNames,
  addRowToSheet,
};
