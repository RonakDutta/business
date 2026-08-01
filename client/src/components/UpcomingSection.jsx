import { Link } from "react-router-dom";
import EventCard from "./EventCard.jsx";
import { ClayCalendar } from "./Decor.jsx";
import { ArrowRightIcon, CalendarIcon, ClockIcon, MapPinIcon } from "./icons.jsx";
import { VENUE } from "../data/venue.js";

const FACTS = [
  { Icon: CalendarIcon, label: "Every second Saturday" },
  { Icon: ClockIcon, label: "11:00 AM , 1:00 PM" },
  { Icon: MapPinIcon, label: VENUE.shortName },
];

// Page 2 of the sketch: the pitch, how the meetup runs and the buttons on the
// left, the next meetup's card on the right.
export default function UpcomingSection({ events = [] }) {
  const nextEvent = events.find((event) => !event.cancelled) || events[0];

  return (
    <section
      id="events"
      className="band-white relative px-5 py-16 sm:px-6 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="reveal">
            <h2 className="text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[38px] md:text-[44px]">
              Upcoming events
            </h2>

            <p className="mt-5 max-w-[420px] text-[17px] leading-[1.7] text-muted sm:text-[19px]">
              Attend the next event and feel supported.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <ul className="flex flex-col gap-3">
                {FACTS.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-3.5">
                    <span className="clay grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-white text-accent">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-[15px] font-bold text-ink sm:text-[16px]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <ClayCalendar className="pointer-events-none hidden h-auto w-[170px] shrink-0 sm:block" />
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to={nextEvent ? `/events/${nextEvent.id}` : "/events"}
                className="clay clay-press inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-7 py-4 text-[15px] font-bold text-white hover:text-white"
              >
                Wish to attend
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <Link
                to="/guidelines"
                className="text-[15px] font-bold text-accent underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                Guidelines
              </Link>
            </div>
          </div>

          <div>
            <div className="reveal mb-4 flex justify-end">
              <Link
                to="/events"
                className="clay clay-press group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-ink"
              >
                See all
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
              </Link>
            </div>

            {nextEvent ? (
              <EventCard event={nextEvent} variant="upcoming" />
            ) : (
              <div className="reveal clay rounded-panel bg-white py-16 text-center">
                <p className="text-[16px] font-bold text-ink">No dates up yet</p>
                <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-muted">
                  The next edition has not been announced. It runs every second
                  Saturday , check back in a few days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
