import { useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Avatar from "../components/Avatar.jsx";
import AvatarStack from "../components/AvatarStack.jsx";
import BackLink from "../components/BackLink.jsx";
import EventMeta from "../components/EventMeta.jsx";
import EventActionBar from "../components/EventActionBar.jsx";
import MapEmbed from "../components/MapEmbed.jsx";
import MetroRoute from "../components/MetroRoute.jsx";
import AttendeeList from "../components/AttendeeList.jsx";
import NotFound from "./NotFound.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { HOST } from "../data/events.js";
import { useEvents } from "../context/EventsContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/* ===========================================================================
   EVENT DETAIL

   THE HOLE. A 2-column grid with the prose left and a tall sticky sidebar
   right only works if the prose is the longer of the two. Ours is four
   sentences and the sidebar carried a map, so the left column ran out and left
   a screen-height of white. Fixed by deleting the sidebar: every section is
   full width and stacked on a fixed label rail, which can't leave a hole no
   matter how short the content beside it gets.

   RSVP lives in the floating bar (EventActionBar) and nowhere else. It was
   briefly a stub on the ticket plus a closing band — that put the price in
   four places, stacked a second black panel on top of the footer's, and made
   the ticket's last column read as a stray "GOING 3". One RSVP control, one
   price, one black panel on the page.

   The shape: a ticket (cover + perforation + facts), then sections on a label
   rail — editorial rather than listing.
   =========================================================================== */

/** Section heading in the left rail. Sticky so it stays with its content. */
function Row({ label, count, children }) {
  return (
    <section className="reveal grid grid-cols-1 gap-x-10 gap-y-5 border-t border-line pt-8 lg:grid-cols-[150px_1fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.09em] text-ink">
          {label}
        </h2>
        {count && (
          <div className="mt-1.5 text-[12.5px] font-semibold text-subtle">
            {count}
          </div>
        )}
      </div>

      <div className="min-w-0">{children}</div>
    </section>
  );
}

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
      {/* Extra phone padding reserves room for the two-row action bar. */}
      <article className="mx-auto max-w-shell px-5 pb-32 pt-6 sm:px-6 sm:pt-8 md:px-10">
        <BackLink to={-1}>Back</BackLink>

        {/* ---- The ticket ---------------------------------------------- */}
        <div className="reveal mt-5 overflow-hidden rounded-panel border border-line bg-white shadow-[0_24px_50px_-45px_rgba(15,23,42,.55)]">
          <header className="relative bg-ink">
            {/*
              On phones the image is a clean banner and the type sits on the
              ink panel *below* it — the long title used to be absolutely
              positioned over a 250px photo and buried it whole. From sm up
              there's room, so the block goes back to an overlay on the image
              with a scrim.
            */}
            <div className="h-[190px] sm:h-[300px] md:h-[440px]">
              <CoverImage
                src={event.image}
                alt={event.title}
                label="EVENT COVER"
                className="h-full w-full"
                loading="eager"
              />
            </div>

            {/* Scrim. Overlay only — on mobile the type isn't on the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden bg-gradient-to-t from-ink via-ink/60 to-ink/10 sm:block"
            />

            <div className="relative p-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-6 md:p-10">
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

              <h1 className="mt-3.5 max-w-[820px] text-[23px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white [text-wrap:balance] sm:mt-4 sm:text-[30px] sm:leading-[1.08] md:text-[46px]">
                {event.title}
              </h1>

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

          {/* The perforation. */}
          <div className="border-t border-dashed border-line-strong">
            <EventMeta event={event} />
          </div>
        </div>

        {/* ---- Sections on a rail -------------------------------------- */}
        <div className="mt-10 flex flex-col gap-10 sm:mt-14 sm:gap-12">
          {/* The fee is on the ticket. It was also the rail count and the first
              line of the body — the same number three times in one screen. */}
          <Row label="Details">
            <div className="flex max-w-[68ch] flex-col gap-4">
              {event.description.map((para, i) => (
                <p key={i} className="text-[16px] leading-[1.75] text-muted">
                  {para}
                </p>
              ))}
            </div>
          </Row>

          <Row label="Getting there" count={event.location.shortName}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
              <div>
                {event.location.gate && (
                  <p className="inline-flex items-center gap-2 rounded-btn bg-accent/10 px-3.5 py-1.5 text-[12.5px] font-bold text-accent">
                    Enter via {event.location.gate}
                  </p>
                )}

                <MetroRoute metro={event.location.metro} className="mt-6" />

                {event.helpline && (
                  <p className="mt-6 text-[12.5px] leading-relaxed text-subtle">
                    Lost on the day? Call{" "}
                    <a
                      href={`tel:${event.helpline}`}
                      className="font-bold text-accent"
                    >
                      {event.helpline}
                    </a>
                    . Directions only — not for questions about the event.
                  </p>
                )}
              </div>

              {/* The map earns width here rather than height in a sidebar. */}
              <div className="overflow-hidden rounded-card border border-line">
                <MapEmbed
                  location={event.location}
                  title={event.location.name}
                />
              </div>
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
              you={user && isGoing(event.id) ? user : null}
              bare
            />
          </Row>
        </div>
      </article>

      <EventActionBar event={event} />
    </>
  );
}
