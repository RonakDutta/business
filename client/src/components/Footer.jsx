import { Link } from "react-router-dom";
import Wordmark from "./Wordmark.jsx";
import { SOCIALS } from "../data/socials.js";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  UsersIcon,
  XIcon,
} from "./icons.jsx";

/* Everything here is a real route , the old #contact / #guidelines anchors
   pointed at the footer itself, which was a link to nowhere. */
const COLUMNS = [
  {
    id: "explore",
    heading: "EXPLORE",
    links: [
      { label: "Home", to: "/" },
      { label: "All events", to: "/events" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  {
    id: "community",
    heading: "COMMUNITY",
    links: [
      { label: "Guidelines", to: "/guidelines" },
      { label: "House rules", to: "/guidelines#house-rules" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    id: "reach-us",
    heading: "REACH US",
    links: [
      { label: "hello@business4.com", href: "mailto:hello@business4.com" },
      { label: "9999658436", href: "tel:9999658436" },
      { label: "Shaheedi Park, New Delhi", to: "/contact" },
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

function FooterLink({ link }) {
  const cls = "text-sm opacity-75 transition-opacity hover:opacity-100";

  if (link.to) {
    return (
      <Link to={link.to} className={cls}>
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className={cls}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </a>
  );
}

/**
 * Icons, not names. Five more text links would compete with the nav columns
 * for attention; five circles read as one object.
 */
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
            aria-label={`${s.label} , ${s.handle}`}
            title={s.handle}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.08] text-white/70 transition-[scale,background,color] duration-300 ease-smooth hover:scale-110 hover:bg-white hover:text-ink"
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        );
      })}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-shell px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-3.5 max-w-[260px] text-sm leading-relaxed opacity-60">
              A community of marketers, founders, and freelancers who meet,
              learn, and grow together. Every second Saturday, at Shaheedi Park.
            </p>

            <div className="mt-7">
              <div className="mb-3 text-xs font-bold tracking-[0.08em] opacity-45">
                FOLLOW
              </div>
              <Socials />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.id} id={col.id} className="flex flex-col gap-3">
              <div className="mb-0.5 text-xs font-bold tracking-[0.08em] opacity-45">
                {col.heading}
              </div>
              {col.links.map((link) => (
                <FooterLink key={link.label} link={link} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-[13px] opacity-55">
          <span>
            © {new Date().getFullYear()} Business 4.0 Community. All rights
            reserved.
          </span>
          <span className="flex gap-[22px]">
            <Link to="/guidelines" className="hover:text-white">
              Guidelines
            </Link>
            <Link to="/guidelines#house-rules" className="hover:text-white">
              Code of conduct
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
