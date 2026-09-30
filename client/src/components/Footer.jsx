import { Link } from "react-router-dom";
import Wordmark from "./Wordmark.jsx";
import { SOCIALS } from "../data/socials.js";
import { VENUE } from "../data/venue.js";
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  XIcon,
} from "./icons.jsx";

const EMAIL = "hello@business4.com";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Events", to: "/events" },
      { label: "Gallery", to: "/gallery" },
      { label: "Team", to: "/team" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Guidelines", to: "/guidelines" },
      { label: "House rules", to: "/guidelines#house-rules" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

/* Add a network: add it to data/socials.js, then map its icon here. */
const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  meetup: UsersIcon,
};

function Socials() {
  const links = SOCIALS.filter((s) => s.url && ICONS[s.id]);
  if (!links.length) return null;

  return (
    <div className="flex gap-2">
      {links.map((s) => {
        const Icon = ICONS[s.id];
        return (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label}: ${s.handle}`}
            title={s.handle}
            className="grid h-9 w-9 place-items-center rounded-full text-white/65 ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        );
      })}
    </div>
  );
}

const colHeading = "text-[13px] font-semibold text-white";
const colLink = "text-[14.5px] text-white/65 transition-colors duration-200 hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="shell">
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-[560px]">
            <h2 className="font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[34px]">
              Come to the next meetup.
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/65">
              Every second Saturday, 11 AM to 1 PM, at {VENUE.shortName} in
              Shaheedi Park, New Delhi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn btn-light">
              See upcoming events
              <ArrowRightIcon />
            </Link>
            <Link to="/contact" className="btn btn-outline-light">
              Contact the team
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] md:py-14">
          <div className="col-span-2 md:col-span-1">
            <Wordmark tone="light" />
            <p className="mt-4 max-w-[300px] text-[14.5px] leading-relaxed text-white/60">
              A community of marketers, founders and freelancers who meet,
              learn and grow together.
            </p>
            <div className="mt-6">
              <Socials />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className={colHeading}>{col.heading}</div>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={colLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div id="reach-us" className="col-span-2 md:col-span-1">
            <div className={colHeading}>Reach us</div>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a href={`mailto:${EMAIL}`} className={`${colLink} inline-flex items-center gap-2.5`}>
                  <MailIcon className="h-4 w-4 shrink-0 text-white/45" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${VENUE.helpline}`} className={`${colLink} inline-flex items-center gap-2.5`}>
                  <PhoneIcon className="h-4 w-4 shrink-0 text-white/45" />
                  {VENUE.helpline}
                </a>
              </li>
              <li>
                <Link to="/contact" className={`${colLink} inline-flex items-start gap-2.5`}>
                  <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-white/45" />
                  <span>
                    {VENUE.shortName}, Shaheedi Park
                    <br />
                    {VENUE.city}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Business 4.0 Community. All rights reserved.</span>
          <span className="flex gap-5">
            <Link to="/guidelines#house-rules" className="transition-colors hover:text-white">
              Code of conduct
            </Link>
            <Link to="/guidelines" className="transition-colors hover:text-white">
              Guidelines
            </Link>
            <Link to="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
