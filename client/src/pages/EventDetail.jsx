import { Link, useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Avatar from "../components/Avatar.jsx";
import AvatarStack from "../components/AvatarStack.jsx";
import EventMeta from "../components/EventMeta.jsx";
import EventActionBar from "../components/EventActionBar.jsx";
import MapEmbed from "../components/MapEmbed.jsx";
import MetroRoute from "../components/MetroRoute.jsx";
import AttendeeList from "../components/AttendeeList.jsx";
import EventComments from "../components/EventComments.jsx";
import LoadingState from "../components/LoadingState.jsx";
import NotFound from "./NotFound.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { HOST } from "../data/events.js";
import { useEvents } from "../context/EventsContext.jsx";

/* ===========================================================================
   EVENT DETAIL

   Title and photo side by side at the top, then the three facts people look
   for (when, where, what it costs), then full-width sections on a label rail.
   There is deliberately no sidebar: the description is often only a few
   sentences, and a tall sidebar next to it left a screen of empty space.

   RSVP lives in the floating bar at the bottom (EventActionBar) and nowhere
   else, so the price and the button are stated once.
   =========================================================================== */

// A section with its label in a rail on the left on wide screens.
function Row({ label, count, children }) {
  return (
    <section className="reveal grid grid-cols-1 gap-x-12 gap-y-5 border-t border-line pt-10 lg:grid-cols-[180px_1fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{label}</h2>
        {count && <p className="mt-1 text-[14px] text-subtle">{count}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const { getEventById, ready } = useEvents();
  const event = getEventById(id);

  useReveal([id, Boolean(event)]);

  // Events come from the server; don't call it missing before it has loaded.
  if (!event) {
    return ready ? (
      <NotFound />
    ) : (
      <div className="shell py-16">
        <LoadingState message="Loading the event" />
      </div>
    );
  }

  const isPast = event.status === "past";

  const status = event.cancelled
    ? { label: "Cancelled", cls: "bg-red-50 text-red-700" }
    : isPast
      ? { label: "Past event", cls: "bg-surface-strong text-muted" }
      : { label: "Upcoming", cls: "bg-accent/10 text-accent" };

  return (
    <>
      {/* Extra bottom padding keeps the floating action bar off the content. */}
      <article className="pb-36">
        <header className="border-b border-line bg-surface">
          <div className="shell pb-10 pt-8 md:pb-14 md:pt-12">
            <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-subtle">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">Home</Link>
                </li>
                <li aria-hidden="true" className="text-faint">/</li>
                <li>
                  <Link to="/events" className="transition-colors hover:text-ink">Events</Link>
                </li>
                <li aria-hidden="true" className="text-faint">/</li>
                <li aria-current="page" className="max-w-[40ch] truncate font-medium text-ink">
                  {event.date}
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div className="reveal order-2 lg:order-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={`badge ${status.cls}`}>{status.label}</span>
                  <span className="text-[14px] font-semibold text-accent">{event.date}</span>
                </div>

                <h1 className="display-page mt-4">{event.title}</h1>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar person={HOST} size={40} ring />
                    <div>
                      <div className="text-[14.5px] font-semibold text-ink">
                        Hosted by {HOST.name}
                      </div>
                      <div className="text-[13px] text-subtle">{HOST.role}</div>
                    </div>
                  </div>

                  {event.attendeeCount > 0 && (
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="hidden h-8 w-px bg-line-strong sm:block" />
                      <AvatarStack
                        people={event.attendees}
                        total={event.attendeeCount}
                        max={5}
                        size={30}
                        className="[&>span]:ring-surface"
                      />
                      <span className="text-[14px] text-muted">
                        {event.attendeeCount} {isPast ? "came" : "going"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="reveal order-1 overflow-hidden rounded-panel bg-surface-strong lg:order-2">
                <CoverImage
                  src={event.image}
                  alt={event.title}
                  label=""
                  loading="eager"
                  className="aspect-[16/10] w-full"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="reveal -mt-px pt-10 md:pt-12">
            <EventMeta event={event} />
          </div>

          <div className="mt-12 flex flex-col gap-12 md:mt-16">
            <Row label="Details">
              <div className="flex max-w-[68ch] flex-col gap-4">
                {event.description.map((para, i) => (
                  <p key={i} className="text-[16.5px] leading-[1.75] text-muted">
                    {para}
                  </p>
                ))}
              </div>
            </Row>

            <Row label="Getting there" count={event.location.shortName}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
                <div>
                  {event.location.gate && (
                    <p className="badge bg-accent/10 text-accent">
                      Enter via {event.location.gate}
                    </p>
                  )}

                  <MetroRoute metro={event.location.metro} className="mt-6" />

                  {event.helpline && (
                    <p className="mt-6 text-[13.5px] leading-relaxed text-subtle">
                      Lost on the day? Call{" "}
                      <a href={`tel:${event.helpline}`} className="link">
                        {event.helpline}
                      </a>
                      . This number is for directions only, not for questions
                      about the event.
                    </p>
                  )}
                </div>

                <MapEmbed location={event.location} title={event.location.name} />
              </div>
            </Row>

            <Row
              label={isPast ? "Who came" : "Who's coming"}
              count={`${event.attendeeCount.toLocaleString("en-IN")} ${isPast ? "attended" : "going"}`}
            >
              <AttendeeList
                attendees={event.attendees}
                total={event.attendeeCount}
                past={isPast}
                host={HOST}
                bare
              />
            </Row>

            {/* Only on editions that have happened: there is nothing to say
                about a room nobody has sat in yet. */}
            {isPast && !event.cancelled && (
              <Row label="Comments">
                <EventComments event={event} />
              </Row>
            )}
          </div>
        </div>
      </article>

      <EventActionBar event={event} />
    </>
  );
}
