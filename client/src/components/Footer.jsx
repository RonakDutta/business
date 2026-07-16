import { Link } from "react-router-dom";
import Newsletter from "./Newsletter.jsx";
import Wordmark from "./Wordmark.jsx";

/* Everything here is now a real route — the old #contact / #guidelines
   anchors pointed at the footer itself, which was a link to nowhere. */
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
    id: "connect",
    heading: "CONNECT",
    links: [
      { label: "Meetup", href: "https://www.meetup.com/business4-0", external: true },
      { label: "hello@business4.com", href: "mailto:hello@business4.com" },
      { label: "9999658436", href: "tel:9999658436" },
    ],
  },
];

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

export default function Footer() {
  return (
    <footer className="mx-auto max-w-shell px-6 pb-12 md:px-10">
      <div className="reveal overflow-hidden rounded-panel bg-ink text-white">
        <Newsletter />

        <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:p-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-3.5 max-w-[260px] text-sm leading-relaxed opacity-60">
              A community of marketers, founders, and freelancers who meet,
              learn, and grow together. Every second Saturday, at Shaheedi Park.
            </p>
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-8 py-6 text-[13px] opacity-55 md:px-14">
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
