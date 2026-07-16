import { Link, useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Avatar from "../components/Avatar.jsx";
import EventMeta from "../components/EventMeta.jsx";
import MapEmbed from "../components/MapEmbed.jsx";
import AttendeeList from "../components/AttendeeList.jsx";
import EventActionBar from "../components/EventActionBar.jsx";
import NotFound from "./NotFound.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { HOST } from "../data/events.js";
import { useEvents } from "../context/EventsContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { priceLabel, isFree } from "../lib/format.js";

export default function EventDetail() {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const { isGoing } = useRsvp();
  const { user } = useAuth();
  const event = getEventById(id);

  useReveal([id]);

  if (!event) return <NotFound />;

  const isPast = event.status === "past";

  return (
    <>
      {/* pb-32 reserves room for the floating action bar */}
      <article className="mx-auto max-w-shell px-6 pb-32 pt-10 md:px-10">
        <Link to={-1} className="text-sm font-bold text-accent">
          ← Back
        </Link>

        {/* Cover. Set `image` on the meetup (admin → edit) to replace. */}
        <div className="reveal mt-6 h-[220px] overflow-hidden rounded-panel md:h-[380px]">
          <CoverImage
            src={event.image}
            alt={event.title}
            label="EVENT COVER"
            className="h-full w-full"
            loading="eager"
          />
        </div>

        <header className="reveal mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.06em] uppercase ${
                event.cancelled
                  ? "bg-red-600 text-white"
                  : isPast
                    ? "bg-line text-subtle"
                    : "bg-accent/10 text-accent"
              }`}
            >
              {event.cancelled
                ? "Cancelled"
                : isPast
                  ? "Past event"
                  : "Upcoming"}
            </span>
            <span className="text-sm font-semibold text-subtle">
              {event.place}
            </span>
          </div>

          <h1 className="mt-4 max-w-[760px] text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[46px]">
            {event.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <Avatar person={HOST} size={40} ring />
            <div>
              <div className="text-[14px] font-bold text-ink">
                Hosted by {HOST.name}
              </div>
              <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-accent">
                {HOST.role}
              </div>
            </div>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Left — details */}
          <div className="reveal">
            <h2 className="text-[24px] font-extrabold tracking-[-0.025em]">
              Details
            </h2>
            <div className="mt-2 h-[3px] w-12 rounded-full bg-accent" />

            <p className="mt-7 text-[15px] font-bold text-ink">
              Entry fee: {priceLabel(event.entryFee)}
              {isFree(event.entryFee) && (
                <span className="ml-2 font-semibold text-subtle">
                  — no charge for this one
                </span>
              )}
            </p>

            <div className="mt-5 space-y-4">
              {event.description.map((para, i) => (
                <p key={i} className="text-[16px] leading-[1.75] text-muted">
                  {para}
                </p>
              ))}
            </div>

            {/* Getting there */}
            <div className="mt-10">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">
                Getting there
              </h2>
              <div className="mt-2 h-[3px] w-12 rounded-full bg-accent" />

              {event.location.gate && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-btn bg-accent/10 px-4 py-2 text-[13px] font-bold text-accent">
                  Enter via {event.location.gate}
                </p>
              )}

              {event.location.metro?.length > 0 && (
                <div className="mt-6">
                  <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-subtle">
                    Nearest metro stations
                  </div>
                  <ul className="mt-3 divide-y divide-line rounded-card border border-line">
                    {event.location.metro.map((m) => (
                      <li
                        key={m.name}
                        className="flex items-center justify-between px-5 py-3.5"
                      >
                        <span className="text-[15px] font-bold text-ink">
                          {m.name}
                        </span>
                        <span className="font-mono text-[13px] text-subtle">
                          {m.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <MapEmbed
                  location={event.location}
                  title={event.location.name}
                />
              </div>
            </div>
          </div>

          {/* Right — when & where */}
          <EventMeta event={event} />
        </div>

        <div className="mt-16">
          <AttendeeList
            attendees={event.attendees}
            total={event.attendeeCount}
            past={isPast}
            you={user && isGoing(event.id) ? user : null}
          />
        </div>
      </article>

      <EventActionBar event={event} />
    </>
  );
}
