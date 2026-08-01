import { VENUE } from "../data/venue.js";
import { DEFAULT_DESCRIPTION } from "../data/events.js";
import { eventDateLabel, eventWhenHeadline } from "./format.js";
import { isResolvedImage } from "./image.js";

// Turns one event from the API into the shape the pages use.
// The date doubles as the id, because that is what the URL shows
// (/events/2026-07-18). serverId is the real database id used for API calls.
export function buildEvent(eventFromApi) {
  const date = eventFromApi.date;
  const attendeeCount = eventFromApi.attendeeCount || 0;
  const isPast = eventFromApi.isPast;
  const photos = eventFromApi.photos || [];

  return {
    id: date,
    serverId: eventFromApi.id,

    title: eventFromApi.title,
    entryFee: eventFromApi.entryFee,
    description: eventFromApi.description?.length
      ? eventFromApi.description
      : DEFAULT_DESCRIPTION,
    image: eventFromApi.image || "/images/events/eventtemp.jpg",

    cancelled: eventFromApi.cancelled,
    status: eventFromApi.status,
    isPast,

    startsAt: `${date}T11:00:00+05:30`,
    endsAt: `${date}T13:00:00+05:30`,
    date: eventDateLabel(date, isPast),
    when: {
      headline: eventWhenHeadline(date),
      repeat: eventFromApi.cancelled
        ? "This edition was cancelled"
        : isPast
          ? "This edition has ended"
          : "Every 2 weeks on Saturday",
    },

    location: VENUE,
    place: isPast
      ? `${VENUE.shortName} · ${attendeeCount} attended`
      : `${VENUE.shortName} · In person`,
    helpline: VENUE.helpline,

    attendeeCount,
    attendees: (eventFromApi.attendees || []).map((person) => ({
      id: person.id,
      name: person.name,
      role: "Member",
    })),

    photos,
    gallery: photos.map((url, index) => ({
      id: `${date}-${index + 1}`,
      src: isResolvedImage(url) ? url : `/images/gallery/${date}/${url}`,
      alt: "",
    })),
  };
}

export const sortByDateAsc = (a, b) => a.startsAt.localeCompare(b.startsAt);
export const sortByDateDesc = (a, b) => b.startsAt.localeCompare(a.startsAt);
