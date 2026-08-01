import { env } from "../config/env.js";
import { isSheetsConfigured, getTabNames, addRowToSheet } from "../config/sheets.js";

async function testSheets() {
  console.log("Spreadsheet id:", env.sheets.id || "(not set)");
  console.log("Contact tab:", env.sheets.contactTab);
  console.log("RSVP tab:", env.sheets.rsvpTab);

  if (!isSheetsConfigured) {
    console.log("\nGoogle Sheets is not set up. Add GOOGLE_SHEETS_ID and your key to .env");
    return;
  }

  const tabNames = await getTabNames();
  console.log("Tabs in this spreadsheet:", tabNames.join(", "));

  for (const tabName of [env.sheets.contactTab, env.sheets.rsvpTab]) {
    const added = await addRowToSheet(tabName, [
      new Date().toISOString(),
      "test row",
      "you can delete this",
    ]);
    console.log(added ? `Wrote to "${tabName}"` : `Could not write to "${tabName}"`);
  }
}

testSheets().catch((error) => {
  console.error("Test failed:", error.message);
  console.error("Is the spreadsheet shared with your service account email?");
  process.exitCode = 1;
});
