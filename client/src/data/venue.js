/* ---------------------------------------------------------------------------
   THE VENUE

   Every meetup happens here, so it lives in one place instead of being copied
   onto each event. When the venue changes, change it here and every event
   follows — that's the seam the admin panel will eventually write to.

   If you ever run an event somewhere else, add a `location: {...}` key to that
   event in events.js and it overrides this.
   --------------------------------------------------------------------------- */

export const VENUE = {
  name: "Project Otenga — Shaheedi Park",
  shortName: "Project Otenga",
  address: "Gate No. 1, Bahadur Shah Zafar Marg, inside Shaheedi Park",
  city: "New Delhi 110002",

  gate: "Gate No. 1",

  // Straight from the meetup listing — this is the thing people get wrong.
  entryNote: "",

  metro: [
    { name: "ITO", distance: "650 m" },
    { name: "Delhi Gate", distance: "900 m" },
    { name: "Mandi House", distance: "1.7 km" },
  ],

  helpline: "9999658436",
  helplineNote:
    "For directions on the day only — please don't call to ask about the event or to have the location sent over.",
};
