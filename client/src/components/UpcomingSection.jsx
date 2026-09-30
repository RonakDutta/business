import { Link } from "react-router-dom";
import EventCard from "./EventCard.jsx";
import LoadingState from "./LoadingState.jsx";
import { ArrowRightIcon, CalendarIcon, ClockIcon, MapPinIcon } from "./icons.jsx";
import { VENUE } from "../data/venue.js";
import { useEvents } from "../context/EventsContext.jsx";

const FACTS = [
  { Icon: CalendarIcon, label: "Every second Saturday" },
  { Icon: ClockIcon, label: "11:00 AM to 1:00 PM" },
  { Icon: MapPinIcon, label: `${VENUE.shortName}, Shaheedi Park` },
];

// Page 2 of the sketch: the pitch, how the meetup runs and the buttons on the
// left, the next meetup's card on the right.
export default function UpcomingSection({ events = [] }) {
  const { ready } = useEvents();
  const nextEvent = events.find((event) => !event.cancelled) || events[0];

  return (
    <section id="events" className="section scroll-mt-20">
      <div className="shell grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="reveal">
          <h2 className="display-2">Upcoming event</h2>

          <p className="lead mt-4 max-w-[440px]">
            Attend the next event and feel supported.
          </p>

          <ul className="mt-8 divide-y divide-line border-y border-line">
            {FACTS.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3.5 py-4">
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-[16px] font-medium text-ink">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={nextEvent ? `/events/${nextEvent.id}` : "/events"}
              className="btn btn-primary w-full sm:w-auto"
            >
              Wish to attend
              <ArrowRightIcon />
            </Link>
            <Link to="/guidelines" className="btn btn-secondary w-full sm:w-auto">
              Read the guidelines
            </Link>
          </div>
        </div>

        <div>
          <div className="reveal mb-4 flex items-center justify-between gap-4">
            <span className="text-[14px] font-medium text-subtle">
              Next on the calendar
            </span>
            <Link to="/events" className="link-arrow text-[14.5px]">
              See all events
              <ArrowRightIcon />
            </Link>
          </div>

          {!ready ? (
            <LoadingState message="Loading the next meetup" />
          ) : nextEvent ? (
            <EventCard event={nextEvent} variant="upcoming" featured />
          ) : (
            <div className="reveal card px-6 py-14 text-center">
              <p className="text-[17px] font-semibold text-ink">No date announced yet</p>
              <p className="mx-auto mt-2 max-w-[320px] text-[14.5px] leading-relaxed text-muted">
                The meetup runs every second Saturday. The next date goes up
                here a couple of weeks before.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
