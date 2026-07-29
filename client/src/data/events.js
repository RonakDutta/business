// Fixed content for the site. Everything about actual meetups now comes
// from the backend; only these stay in the code.

export const heroSlides = [
  {
    id: "s1",
    label: "HERO PHOTO 1",
    src: "/images/hero/hero1.jpg",
    alt: "Members talking in small groups before the session",
  },
  {
    id: "s2",
    label: "HERO PHOTO 2",
    src: "/images/hero/hero2.jpg",
    alt: "A speaker presenting to the room",
  },
  {
    id: "s3",
    label: "HERO PHOTO 3",
    src: "/images/hero/hero3.jpg",
    alt: "Attendees networking during the break",
  },
];

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

// Every meetup is run by the same person, so this is not stored per event.
export const HOST = {
  id: "host",
  name: "Vishal S.",
  role: "Super organiser",
  avatar: "/images/team/vishal.jpg",
};

export const DEFAULT_TITLE = "Business4.0 Meetup (Entry Fee Applicable)";

export const DEFAULT_DESCRIPTION = [
  "With 188 successful editions back to back. We are now announcing our 189th. Business4.0 meetup. Do check photos of past events in respective meetups.",
  "If you run a start-up, are working in one, or want to work in one, feel free to join in for a fun 2 hours of networking and getting to know people from this world. Bring extra 2 hrs in hand as conversations usually overflow.",
];
