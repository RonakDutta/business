/* ---------------------------------------------------------------------------
   SOCIAL LINKS

   >>> THE URLS BELOW ARE GUESSES. Replace them with the real profiles. <<<

   Meetup is the only one confirmed. The rest are the community's pages that
   nobody has sent me the addresses for yet , they're shaped correctly and
   pointed at plausible handles so the footer looks right, but every one of
   them needs checking before this is public.

   To drop a network: delete its entry. To add one: add an entry and map its
   `icon` key in components/Footer.jsx. Anything with an empty `url` is skipped
   automatically, so you can also just blank one out until you have the link.
   --------------------------------------------------------------------------- */

export const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@business4.0",
    url: "https://www.instagram.com/business4.0/", // TODO: confirm
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Business 4.0",
    url: "https://www.facebook.com/business4.0/", // TODO: confirm
  },
  {
    id: "x",
    label: "X",
    handle: "@business4_0",
    url: "https://x.com/business4_0", // TODO: confirm
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Business 4.0",
    url: "https://www.linkedin.com/company/business4-0/", // TODO: confirm
  },
  {
    id: "meetup",
    label: "Meetup",
    handle: "business4-0",
    url: "https://www.meetup.com/business4-0", // confirmed
  },
];
