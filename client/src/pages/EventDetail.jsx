import { useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Avatar from "../components/Avatar.jsx";
import AvatarStack from "../components/AvatarStack.jsx";
import BackLink from "../components/BackLink.jsx";
import EventMeta from "../components/EventMeta.jsx";
import MapEmbed from "../components/MapEmbed.jsx";
import MetroRoute from "../components/MetroRoute.jsx";
import AttendeeList from "../components/AttendeeList.jsx";
import EventActionBar from "../components/EventActionBar.jsx";
import NotFound from "./NotFound.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { HOST } from "../data/events.js";
import { useEvents } from "../context/EventsContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { priceLabel, isFree } from "../lib/format.js";

/* ===========================================================================
   EVENT DETAIL

   Reshaped away from the listing-site layout it had grown into (cover, then
   title, then a two-column body with the facts card stacked in a sidebar ,
   which is meetup.com's page, near enough).

   What moved:
   - The title now sits ON the cover, over a scrim, instead of underneath it.
     One object at the top of the page rather than two stacked ones.
   - When/where/entry became a strip across the full width (see EventMeta),
     so the description isn't squeezed into a narrow column for its length.
   - Getting there is a proper aside now, with the metro route as a route.

   Same data, same components, different shape.
   =========================================================================== */

export default function EventDetail() {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const { isGoing } = useRsvp();
  const { user } = useAuth();
  const event = getEventById(id);

  useReveal([id]);

  if (!event) return <NotFound />;

  const isPast = event.status === "past";

  const statusCls = event.cancelled
    ? "bg-red-600 text-white"
    : isPast
      ? "bg-white/20 text-white"
      : "bg-accent text-white";

  return (
    <>
      {/* pb-32 reserves room for the floating action bar */}
      <article className="mx-auto max-w-shell px-6 pb-32 pt-8 md:px-10">
        <BackLink to={-1}>Back</BackLink>

        {/* ---- Hero: cover carries the title -------------------------- */}
        <header className="reveal relative mt-5 overflow-hidden rounded-panel bg-ink">
          <div className="h-[300px] md:h-[440px]">
            <CoverImage
              src={event.image}
              alt={event.title}
              label="EVENT COVER"
              className="h-full w-full"
              loading="eager"
            />
          </div>

          {/* Scrim. Heavier at the foot, where the type sits. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${statusCls}`}
              >
                {event.cancelled
                  ? "Cancelled"
                  : isPast
                    ? "Past event"
                    : "Upcoming"}
              </span>
              <span className="text-[13px] font-semibold text-white/70">
                {event.place}
              </span>
            </div>

            <h1 className="mt-4 max-w-[820px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em] text-white [text-wrap:balance] md:text-[46px]">
              {event.title}
            </h1>

            {/* Host and the room, together , the two human facts. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <Avatar person={HOST} size={40} ring />
                <div>
                  <div className="text-[14px] font-bold text-white">
                    Hosted by {HOST.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/50">
                    {HOST.role}
                  </div>
                </div>
              </div>

              {event.attendeeCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="hidden h-8 w-px bg-white/15 sm:block" />
                  <AvatarStack
                    people={event.attendees}
                    total={event.attendeeCount}
                    max={5}
                    size={32}
                    className="[&_span]:ring-ink"
                  />
                  <span className="text-[13px] font-bold text-white/70">
                    {event.attendeeCount} {isPast ? "came" : "going"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---- Facts strip -------------------------------------------- */}
        <div className="mt-6">
          <EventMeta event={event} />
        </div>

        {/* ---- Body: description wide, directions aside --------------- */}
        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="reveal">
            <h2 className="text-[24px] font-extrabold tracking-[-0.025em]">
              Details
            </h2>
            <div className="mt-2 h-[3px] w-12 rounded-full bg-accent" />

            <p className="mt-7 text-[15px] font-bold text-ink">
              Entry fee: {priceLabel(event.entryFee)}
              {isFree(event.entryFee) && (
                <span className="ml-2 font-semibold text-subtle">
                  , no charge for this one
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
          </div>

          <aside className="reveal flex flex-col gap-4 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-panel border border-line bg-white">
              <MapEmbed location={event.location} title={event.location.name} />

              <div className="p-6">
                <h2 className="text-[15px] font-extrabold tracking-[-0.01em]">
                  Getting there
                </h2>

                {event.location.gate && (
                  <p className="mt-3.5 inline-flex items-center gap-2 rounded-btn bg-accent/10 px-3.5 py-1.5 text-[12.5px] font-bold text-accent">
                    Enter via {event.location.gate}
                  </p>
                )}

                <MetroRoute metro={event.location.metro} className="mt-6" />
              </div>
            </div>

            {event.helpline && (
              <p className="px-1 text-[12.5px] leading-relaxed text-subtle">
                Trouble finding the venue on the day? Call{" "}
                <a
                  href={`tel:${event.helpline}`}
                  className="font-bold text-accent"
                >
                  {event.helpline}
                </a>
                . Directions only , not for questions about the event.
              </p>
            )}
          </aside>
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
