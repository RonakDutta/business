const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const sheets = require("../utils/sheets");

async function testSheets() {
  console.log("Spreadsheet id:", sheets.sheetId || "(not set)");
  console.log("Contact tab:", sheets.contactTab);
  console.log("RSVP tab:", sheets.rsvpTab);

  if (!sheets.isSheetsConfigured) {
    console.log("\nGoogle Sheets is not set up. Add GOOGLE_SHEETS_ID and your key to .env");
    return;
  }

  try {
    const tabNames = await sheets.getTabNames();
    console.log("Tabs in this spreadsheet:", tabNames.join(", "));

    const tabsToTest = [sheets.contactTab, sheets.rsvpTab];

    for (const tabName of tabsToTest) {
      const added = await sheets.addRowToSheet(tabName, [
        new Date().toISOString(),
        "test row",
        "you can delete this",
      ]);

      if (added) {
        console.log(`Wrote to "${tabName}"`);
      } else {
        console.log(`Could not write to "${tabName}"`);
      }
    }
  } catch (err) {
    console.error("Test failed:", err.message);
    console.error("Is the spreadsheet shared with your service account email?");
    process.exitCode = 1;
  }
}

testSheets();
