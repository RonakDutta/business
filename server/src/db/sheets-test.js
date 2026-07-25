import { env } from "../config/env.js";
import { isSheetsConfigured, listTabs, appendRow } from "../config/sheets.js";

/*
  Diagnostic: `npm run sheets:test`

  Answers, in order, the three things that actually go wrong:
    1. Is Sheets configured at all (id + credentials)?
    2. Can we reach the spreadsheet, and what are its tabs really called?
    3. Does an append to the configured Contact / RSVP tabs succeed?

  It writes one obvious test row into each tab, so you can see it land (and
  delete it afterwards).
*/

async function main() {
  console.log("— Google Sheets check —\n");

  console.log("Spreadsheet id :", env.sheets.id || "(not set)");
  console.log("Contact tab    :", env.sheets.contactTab);
  console.log("RSVP tab       :", env.sheets.rsvpTab);
  console.log(
    "Credentials    :",
    env.sheets.keyFile
      ? `key file (${env.sheets.keyFile})`
      : env.sheets.clientEmail
        ? `inline (${env.sheets.clientEmail})`
        : "(none)",
  );
  console.log("Configured     :", isSheetsConfigured, "\n");

  if (!isSheetsConfigured) {
    console.log(
      "Set GOOGLE_SHEETS_ID and either GOOGLE_APPLICATION_CREDENTIALS or\n" +
        "GOOGLE_SHEETS_CLIENT_EMAIL + GOOGLE_SHEETS_PRIVATE_KEY, then re-run.",
    );
    return;
  }

  let tabs;
  try {
    tabs = await listTabs();
    console.log("Tabs in the spreadsheet:", tabs.join(", "), "\n");
  } catch (err) {
    const detail = err?.response?.data?.error?.message || "";
    console.error("Couldn't open the spreadsheet:", err.message, detail);
    console.error(
      "\nUsual cause: the spreadsheet isn't shared with the service account.\n" +
        "Share it (Editor) with the client_email from your JSON key.",
    );
    return;
  }

  for (const tab of [env.sheets.contactTab, env.sheets.rsvpTab]) {
    if (!tabs.includes(tab)) {
      console.log(`! "${tab}" doesn't exist yet — it will be created on append.`);
    }
    const ok = await appendRow(tab, [
      new Date().toISOString(),
      "sheets:test",
      "delete this row",
    ]);
    console.log(`${ok ? "✓" : "✗"} append to "${tab}"`);
  }

  console.log("\nDone. Delete the test rows when you're happy.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
