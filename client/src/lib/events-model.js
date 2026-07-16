import { VENUE } from "../data/venue.js";
import { POOL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "../data/events.js";
import { eventDateLabel, eventWhenHeadline } from "./format.js";

/* ===========================================================================
   Pure event model. No React, no storage — just record in, event out.

   Kept separate so the admin, the public site and (later) the API can all
   agree on what an event *is* without importing each other.
   =========================================================================== */

const album = (eventId, files = []) =>
  files.map((name, i) => ({
    id: `${eventId}-${i + 1}`,
    src: `/images/gallery/${eventId}/${name}`,
    alt: "",
  }));

/*
  Status comes from the clock, not a hand-set field.

  These meetups run fortnightly, so an event that is "upcoming" today is
  "past" a week later. Deriving it means nobody has to remember to flip it —
  and `cancelled` stays a separate flag so a cancelled meetup doesn't lose
  track of whether it has also already been and gone.
*/
export function buildEvent(m, now = Date.now()) {
  const startsAt = `${m.date}T11:00:00+05:30`;
  const endsAt = `${m.date}T13:00:00+05:30`;
  const past = new Date(endsAt).getTime() < now;
  const location = m.location ?? VENUE;
  const venueName = location.shortName ?? location.name;
  const cancelled = Boolean(m.cancelled);
  const attendeeCount = Number(m.attendeeCount) || 0;

  return {
    id: m.date,
    cancelled,
    status: cancelled ? "cancelled" : past ? "past" : "upcoming",
    isPast: past,
    title: m.title?.trim() || DEFAULT_TITLE,
    entryFee: Number(m.entryFee ?? 150),

    startsAt,
    endsAt,
    date: eventDateLabel(m.date, past),
    when: {
      headline: eventWhenHeadline(m.date),
      repeat: cancelled
        ? "This edition was cancelled"
        : past
          ? "This edition has ended"
          : "Every 2 weeks on Saturday",
    },

    location,
    place: past
      ? `${venueName} · ${attendeeCount} attended`
      : `${venueName} · In person`,
    helpline: location.helpline,

    description: m.description?.length ? m.description : DEFAULT_DESCRIPTION,
    image: m.image ?? "/images/events/eventtemp.jpg",

    attendeeCount,
    attendees: POOL.slice(0, Math.min(attendeeCount, POOL.length)),
    gallery: album(m.date, m.photos ?? []),
  };
}

export const byDateAsc = (a, b) => a.startsAt.localeCompare(b.startsAt);
export const byDateDesc = (a, b) => b.startsAt.localeCompare(a.startsAt);

/** One pass over the records -> every list the app needs. */
export function deriveCollections(meetups, now = Date.now()) {
  const allEvents = meetups.map((m) => buildEvent(m, now)).sort(byDateDesc);

  /* Cancelled meetups stay in the upcoming list on purpose — members need to
     see that it's off. They're dropped from the past list, where they'd just
     be noise. */
  const upcomingEvents = allEvents
    .filter((e) => !e.isPast)
    .sort(byDateAsc);

  const pastEvents = allEvents.filter((e) => e.isPast && !e.cancelled);

  const albums = allEvents
    .filter((e) => e.gallery?.length && !e.cancelled)
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      place: e.place,
      status: e.status,
      cover: e.image,
      photos: e.gallery,
      count: e.gallery.length,
    }));

  return {
    allEvents,
    upcomingEvents,
    pastEvents,
    albums,
    photos: albums.flatMap((a) => a.photos).slice(0, 6),
  };
}
