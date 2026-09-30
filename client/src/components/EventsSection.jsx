import { Link } from "react-router-dom";
import EventCard from "./EventCard.jsx";
import { ArrowRightIcon } from "./icons.jsx";

export default function EventsSection({
  id,
  eyebrow,
  title,
  events,
  variant = "upcoming",
  ctaLabel,
  headingClass = "text-[30px] md:text-[38px]",
  className = "",
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-shell px-6 md:px-10 ${className}`}
    >
      <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          {eyebrow && (
            <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {eyebrow}
            </div>
          )}
          <h2 className={`${headingClass} font-extrabold tracking-tight`}>
            {title}
          </h2>
        </div>

        {ctaLabel &&
          (variant === "upcoming" ? (
            <Link
              to="/events"
              className="accent-border hover:accent-tint group inline-flex items-center gap-2 whitespace-nowrap rounded-btn border px-5 py-2.75 text-sm font-bold text-accent transition-[background,translate] duration-300 ease-smooth hover:-translate-y-0.5"
            >
              {ctaLabel}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              to="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-accent"
            >
              {ctaLabel}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
            </Link>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} variant={variant} />
        ))}
      </div>
    </section>
  );
}
