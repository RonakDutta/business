/* ---------------------------------------------------------------------------
   THE VENUE

   Every meetup happens here, so it lives in one place instead of being copied
   onto each event. When the venue changes, change it here and every event
   follows , that's the seam the admin panel will eventually write to.

   If you ever run an event somewhere else, add a `location: {...}` key to that
   event in events.js and it overrides this.
   --------------------------------------------------------------------------- */

export const VENUE = {
  name: "Project Otenga , Shaheedi Park",
  shortName: "Project Otenga",
  address: "Gate No. 1, Bahadur Shah Zafar Marg, inside Shaheedi Park",
  city: "New Delhi 110002",

  gate: "Gate No. 1",

  // Straight from the meetup listing , this is the thing people get wrong.
  entryNote: "",

  /*
    One station, not a list.

    This used to be three stations with distances, which invited people to pick
    the wrong one. ITO is the only metro anyone should use for Project Otenga,
    and the part that actually gets people lost is the exit , so the exit gate
    is a field of its own rather than a footnote.

    Rendered as a three-step route (station -> exit -> walk), not a table.
  */
  metro: {
    station: "ITO",
    exit: "Gate No. 4",
    walk: "5 min walk",
    walkTo: "Project Otenga",
  },

  helpline: "9999658436",
  helplineNote:
    "For directions on the day only , please don't call to ask about the event or to have the location sent over.",
};
