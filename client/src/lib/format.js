/** "Free" or "₹150" , one source of truth for how price renders. */
export const priceLabel = (entryFee) =>
  !entryFee ? "Free" : `₹${entryFee.toLocaleString("en-IN")}`;

export const isFree = (entryFee) => !entryFee;

/** Google Calendar wants UTC basic-format: 20260724T130000Z */
const toCalendarStamp = (iso) =>
  new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

export function googleCalendarUrl(event) {
  const { location } = event;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.startsAt)}/${toCalendarStamp(event.endsAt)}`,
    details: event.description?.[0] || "",
    location: [location?.name, location?.address, location?.city]
      .filter(Boolean)
      .join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Text query used for both the maps link and the embedded map. */
const locationQuery = (location) =>
  [location?.name, location?.address, location?.city]
    .filter(Boolean)
    .join(", ");

export const isOnline = (location) => /online/i.test(location?.name || "");

/**
 * Embed URL for the map iframe. Returns null for online events.
 * With VITE_GOOGLE_MAPS_API_KEY set, uses the official Maps Embed API;
 * otherwise falls back to the keyless output=embed endpoint.
 */
export function mapEmbedUrl(location) {
  if (!location || isOnline(location)) return null;

  const q = encodeURIComponent(locationQuery(location));
  const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;

  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=15`
    : `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}

export function mapsUrl(location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationQuery(location),
  )}`;
}

export const eventUrl = (event) =>
  `${window.location.origin}/events/${encodeURIComponent(event.id)}`;

/* ---------------------------------------------------------------------------
   EVENT DATES

   Built from the plain "YYYY-MM-DD" string rather than a parsed Date, so the
   label never shifts because of the reader's timezone. Every meetup is
   11:00 AM - 1:00 PM IST.
   --------------------------------------------------------------------------- */

const WD_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WD_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MO_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const MO_LONG = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const parts = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { y, m, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};

/** Card label. Upcoming leads with the time; past leads with the year. */
export function eventDateLabel(dateStr, past, startTime = "11:00 AM") {
  const { y, m, d, wd } = parts(dateStr);
  return past
    ? `${WD_SHORT[wd]}, ${MO_SHORT[m - 1]} ${d}, ${y}`
    : `${WD_SHORT[wd]}, ${MO_SHORT[m - 1]} ${d} · ${startTime}`;
}

/** Sidebar headline, e.g. "Saturday, Jul 18 · 11:00 AM to 1:00 PM IST" */
export function eventWhenHeadline(
  dateStr,
  startTime = "11:00 AM",
  endTime = "1:00 PM",
) {
  const { m, d, wd } = parts(dateStr);
  return `${WD_LONG[wd]}, ${MO_LONG[m - 1]} ${d} · ${startTime} to ${endTime} IST`;
}
