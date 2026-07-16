import { VENUE } from "./venue.js";

/* ===========================================================================
   IMAGES

   Hero + event covers:  public/images/hero/, public/images/events/
   Reference as "/images/events/eventtemp.jpg" (leading slash, no "public").

   Gallery photos:       public/images/gallery/<event-id>/
   The event id is its DATE , so photos for the Jul 4 meetup live in
   public/images/gallery/2026-07-04/. See `photos:` on each event below.
   =========================================================================== */

export const heroSlides = [
  {
    id: "s1",
    label: "HERO PHOTO 1 , group, warm & candid",
    src: "/images/hero/hero1.jpg",
    alt: "Members talking in small groups before the session",
  },
  {
    id: "s2",
    label: "HERO PHOTO 2 , speaker on stage",
    src: "/images/hero/hero2.jpg",
    alt: "A speaker presenting to the room",
  },
  {
    id: "s3",
    label: "HERO PHOTO 3 , networking break",
    src: "/images/hero/hero3.jpg",
    alt: "Attendees networking during the break",
  },
];

/* Placeholder numbers , swap for real ones. "Cities" is gone: there's one
   venue now, so counting cities was telling on us. */
export const stats = [
  { id: "members", value: 1200, suffix: "+", label: "Community members" },
  { id: "editions", value: 190, suffix: "+", label: "Editions hosted" },
  {
    id: "rating",
    value: 4.7,
    decimals: 1,
    suffix: "★",
    label: "Rating on Meetup.com",
  },
];

/* -------------------------------------------------------------------------
   Attendees. `avatar` hits pravatar.cc , a stand-in until real profiles exist.
   `role` drives the badge: Organiser | Prime member | Member.
   ------------------------------------------------------------------------- */
const person = (id, name, role, img) => ({
  id,
  name,
  role,
  avatar: `https://i.pravatar.cc/160?img=${img}`,
});

export const POOL = [
  person("u1", "Ananya Rao", "Organiser", 5),
  person("u2", "Vikram Shah", "Prime member", 12),
  person("u3", "Priya Menon", "Member", 32),
  person("u4", "Rohit Bansal", "Member", 15),
  person("u5", "Sana Qureshi", "Prime member", 45),
  person("u6", "Karan Malhotra", "Member", 33),
  person("u7", "Meera Iyer", "Member", 44),
  person("u8", "Aditya Nair", "Organiser", 51),
  person("u9", "Neha Kapoor", "Member", 47),
  person("u10", "Farhan Ali", "Prime member", 60),
  person("u11", "Divya Reddy", "Member", 26),
  person("u12", "Siddharth Jain", "Member", 8),
  person("u13", "Tanvi Desai", "Member", 41),
  person("u14", "Arjun Pillai", "Member", 68),
];

/* Hardcoded for now , every meetup is hosted by the same person. When hosts
   vary, move this onto the individual event and default to this. */
export const HOST = {
  id: "host",
  name: "Vishal S.",
  role: "Super organiser",
  avatar: "/images/team/vishal.jpg",
};

const album = (eventId, files = []) =>
  files.map((name, i) => ({
    id: `${eventId}-${i + 1}`,
    src: `/images/gallery/${eventId}/${name}`,
    alt: "",
  }));

/* ===========================================================================
   THE MEETUPS

   Every one is a Saturday, 11:00 AM - 1:00 PM IST, at Project Otenga, every
   two weeks. So each entry below only states what makes it different: the
   date, how many came, and any override.

   Defaults applied to every event:
     title      "Business4.0 Meetup (Entry Fee Applicable)"
     entryFee   150
     location   VENUE  (from venue.js)

   Adding the next meetup is one line. Status works itself out , see build().
   =========================================================================== */

export const DEFAULT_TITLE = "Business4.0 Meetup (Entry Fee Applicable)";

export const DEFAULT_DESCRIPTION = [
  "With 188 successful editions back to back. We are now announcing our 189th. Business4.0 meetup. Do check photos of past events in respective meetups.",
  "If you run a start-up, are working in one, or want to work in one, feel free to join in for a fun 2 hours of networking and getting to know people from this world. Bring extra 2 hrs in hand as conversations usually overflow.",
];

export const SEED_MEETUPS = [
  // --- scheduled ---
  { date: "2026-09-12", attendeeCount: 2 },
  { date: "2026-08-29", attendeeCount: 4 },
  { date: "2026-08-15", attendeeCount: 4 },
  { date: "2026-08-01", attendeeCount: 3 },
  { date: "2026-07-18", attendeeCount: 34 },

  // --- held ---
  { date: "2026-07-04", attendeeCount: 30, photos: ["01.jpg"] },
  { date: "2026-06-20", attendeeCount: 57, photos: ["02.jpg"] },
  { date: "2026-06-06", attendeeCount: 48, photos: ["03.jpg"] },
  { date: "2026-05-23", attendeeCount: 61, photos: ["04.jpg"] },
  { date: "2026-05-09", attendeeCount: 37, photos: ["05.jpg"] },
  { date: "2026-04-25", attendeeCount: 47, photos: ["06.jpg"] },
  { date: "2026-04-04", attendeeCount: 37 },
  { date: "2026-03-21", attendeeCount: 35, entryFee: 100 },
  {
    date: "2026-03-07",
    attendeeCount: 36,
    title: "Business4.0 Meetup",
    entryFee: 0,
  },
  {
    date: "2026-02-28",
    attendeeCount: 4,
    title: "Business4.0 - Business Model Canvas Workshop (Prepaid Only Meetup)",
    entryFee: 2000,
    description: [
      "A prepaid-only workshop on the Business Model Canvas. Fee is ₹2000, payable on the spot.",
      "Register using the Google form: https://forms.gle/3wjJymsgAtYSPSii7",
    ],
  },
];

/* ---------------------------------------------------------------------------
   Everything derived from the list above , statuses, sorting, albums , now
   lives in lib/events-model.js (pure) and context/EventsContext.jsx (state),
   because the admin needs to add and edit meetups at runtime. This file is
   just the seed: the data we start from.

   Import from `useEvents()` rather than from here.
   --------------------------------------------------------------------------- */
