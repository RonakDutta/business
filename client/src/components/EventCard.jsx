import { Link } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useShare } from "../hooks/useShare.js";
import CoverImage from "./CoverImage.jsx";
import AvatarStack from "./AvatarStack.jsx";
import BorderGlow from "./BorderGlow.jsx";
import {
  HeartIcon,
  ShareIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
} from "./icons.jsx";
import { priceLabel } from "../lib/format.js";

/* The id is the date, so the calendar chip needs no extra field to read. */
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const chipParts = (id) => {
  const [, m, d] = id.split("-").map(Number);
  return { day: d, month: MONTHS[m - 1] };
};

/**
 * variant="upcoming" -> live date chip + solid RSVP button
 * variant="past"     -> muted chip + outlined "See details"
 */
export default function EventCard({ event, variant = "upcoming" }) {
  const isUpcoming = variant === "upcoming";
  const cancelled = event.cancelled;
  const { isSaved, toggle } = useSavedEvents();
  const { isGoing } = useRsvp();
  const { share, shared } = useShare(event);

  const saved = isSaved(event.id);
  const going = isGoing(event.id);
  const to = `/events/${event.id}`;
  const { day, month } = chipParts(event.id);

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-[0_2px_8px_-2px_rgba(15,23,42,.3)] transition-[scale,color] duration-200 ease-smooth hover:scale-110 active:scale-95";

  return (
    <BorderGlow
      backgroundColor="#ffffff"
      borderRadius={18}
      glowColor="221 83% 53%"
      colors={["#2563eb", "#3b82f6", "#60a5fa"]}
      glowRadius={32}
      glowIntensity={1.2}
      edgeSensitivity={10}
      className="reveal h-full w-full"
      data-stagger
    >
      <div
        className="group flex h-full flex-col overflow-hidden rounded-[18px] bg-white transition-all duration-300"
      >
        {/* Media. The link covers the tile; the buttons sit above it. */}
        <div className="relative h-[168px] shrink-0 overflow-hidden">
          <CoverImage
            src={event.image}
            alt=""
            label=""
            className="h-full w-full transition-[scale] duration-[600ms] ease-smooth group-hover:scale-[1.04]"
          />

          {/* Scrim: keeps the chips legible whatever photo lands here. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-ink/15"
          />

          <Link to={to} className="absolute inset-0" aria-label={event.title} />

          {/* Date chip , the one thing everyone scans for first. */}
          <div
            className={`pointer-events-none absolute left-3 top-3 flex w-[52px] flex-col items-center rounded-xl py-1.5 ${
              cancelled ? "bg-red-600 text-white" : "bg-white text-ink"
            }`}
          >
            <span className="text-[19px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              {day}
            </span>
            <span
              className={`mt-0.5 text-[9.5px] font-bold tracking-[0.1em] ${
                cancelled ? "text-white/80" : "text-subtle"
              }`}
            >
              {month}
            </span>
          </div>

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => toggle(event.id)}
              aria-pressed={saved}
              aria-label={
                saved ? `Remove ${event.title} from saved` : `Save ${event.title}`
              }
              title={saved ? "Saved" : "Save this event"}
              className={`${iconBtn} ${saved ? "text-accent" : "text-subtle hover:text-ink"}`}
            >
              <HeartIcon filled={saved} className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={share}
              aria-label={`Share ${event.title}`}
              title={shared ? "Link copied" : "Share this event"}
              className={`${iconBtn} text-subtle hover:text-ink`}
            >
              {shared ? (
                <CheckIcon className="h-[18px] w-[18px] text-accent" />
              ) : (
                <ShareIcon className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {/* Bottom strip: price on the left, state on the right. */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink">
              {cancelled ? "Cancelled" : priceLabel(event.entryFee)}
            </span>

            {going && !cancelled && (
              <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
                <CheckIcon className="h-3 w-3" />
                Going
              </span>
            )}
          </div>

          <span role="status" aria-live="polite" className="sr-only">
            {shared ? "Link copied to clipboard" : ""}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <Link
            to={to}
            className="line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em] transition-colors duration-200 hover:text-accent"
          >
            {event.title}
          </Link>

          <div className="mt-3 flex flex-col gap-1.5 text-[13px] text-subtle">
            <span className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0 text-faint" />
              <span className={isUpcoming ? "font-semibold text-muted" : ""}>
                {event.date}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 shrink-0 text-faint" />
              <span className="truncate">
                {event.location.shortName ?? event.location.name}
              </span>
            </span>
          </div>

          <div className="mt-4 flex min-h-[28px] items-center gap-2.5 border-t border-line pt-4">
            <AvatarStack
              people={event.attendees}
              total={event.attendeeCount}
              max={4}
              size={26}
            />
            <span className="text-[12.5px] font-semibold text-subtle">
              {event.attendeeCount === 0
                ? "Be the first"
                : `${event.attendeeCount} ${event.isPast ? "attended" : "going"}`}
            </span>
          </div>

          <Link
            to={to}
            className={
              isUpcoming
                ? "clay clay-press mt-4 block rounded-btn bg-ink p-3 text-center text-sm font-bold text-white hover:text-white"
                : "clay clay-press mt-4 block rounded-btn border border-line-strong bg-white p-3 text-center text-sm font-bold text-muted hover:text-accent"
            }
          >
            {cancelled
              ? "See details"
              : isUpcoming
                ? going
                  ? "You're going"
                  : "RSVP"
                : "See details"}
          </Link>
        </div>
      </div>
    </BorderGlow>
  );
}
