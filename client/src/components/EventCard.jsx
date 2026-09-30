import { Link } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useShare } from "../hooks/useShare.js";
import CoverImage from "./CoverImage.jsx";
import AvatarStack from "./AvatarStack.jsx";
import { HeartIcon, ShareIcon, CheckIcon, MapPinIcon } from "./icons.jsx";
import { priceLabel } from "../lib/format.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The id is the date ("2026-10-10"), so the calendar block needs no extra field.
function dateParts(id) {
  const [, m, d] = id.split("-").map(Number);
  return { day: d, month: MONTHS[m - 1] };
}

/**
 * variant="upcoming" -> solid RSVP button
 * variant="past"     -> outlined "View details"
 * featured           -> taller photo, for the home page
 */
export default function EventCard({ event, variant = "upcoming", featured = false }) {
  const isUpcoming = variant === "upcoming";
  const cancelled = event.cancelled;
  const { isSaved, toggle } = useSavedEvents();
  const { isGoing } = useRsvp();
  const { share, shared } = useShare(event);

  const saved = isSaved(event.id);
  const going = isGoing(event.id);
  const to = `/events/${event.id}`;
  const { day, month } = dateParts(event.id);

  const countText =
    event.attendeeCount === 0
      ? "Be the first to RSVP"
      : `${event.attendeeCount} ${event.isPast ? "attended" : "going"}`;

  const buttonLabel = cancelled
    ? "View details"
    : isUpcoming
      ? going
        ? "You're going"
        : "RSVP"
      : "View details";

  const photoBtn =
    "grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-card transition-colors duration-200";

  return (
    <article
      data-stagger
      className="reveal card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className={`relative shrink-0 overflow-hidden bg-surface ${featured ? "h-56 sm:h-64" : "h-48"}`}>
        <CoverImage
          src={event.image}
          alt=""
          className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
        />

        {/* The whole photo opens the event; the title link below is the one
            keyboard users land on, so this one stays out of the tab order. */}
        <Link to={to} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />

        <div
          className={`pointer-events-none absolute left-3 top-3 flex w-12 flex-col items-center rounded-lg py-1.5 shadow-card ${
            cancelled ? "bg-red-600 text-white" : "bg-white text-ink"
          }`}
        >
          <span className="font-display text-[18px] font-semibold leading-none tabular-nums">
            {day}
          </span>
          <span
            className={`mt-1 text-[11px] font-semibold leading-none ${
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
            aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
            title={saved ? "Saved" : "Save this event"}
            className={`${photoBtn} ${saved ? "text-accent" : "text-muted hover:text-ink"}`}
          >
            <HeartIcon filled={saved} className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={share}
            aria-label={`Share ${event.title}`}
            title={shared ? "Link copied" : "Share this event"}
            className={`${photoBtn} text-muted hover:text-ink`}
          >
            {shared ? (
              <CheckIcon className="h-[18px] w-[18px] text-accent" />
            ) : (
              <ShareIcon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        <span role="status" aria-live="polite" className="sr-only">
          {shared ? "Link copied to clipboard" : ""}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          {cancelled && <span className="badge bg-red-50 text-red-700">Cancelled</span>}
          {going && !cancelled && (
            <span className="badge bg-accent/10 text-accent">
              <CheckIcon className="h-3.5 w-3.5" />
              Going
            </span>
          )}
          <span className="text-[13.5px] font-semibold text-accent">{event.date}</span>
        </div>

        <h3 className={`mt-2 line-clamp-2 font-semibold leading-snug tracking-[-0.01em] ${featured ? "text-[19px] sm:text-[20px]" : "text-[18px]"}`}>
          <Link to={to} className="transition-colors duration-200 hover:text-accent">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-[14px] text-subtle">
          <MapPinIcon className="h-4 w-4 shrink-0 text-faint" />
          <span className="truncate">{event.location.shortName ?? event.location.name}</span>
        </p>

        <div className="mt-auto pt-5">
          <div className="flex min-h-[44px] items-center justify-between gap-3 border-t border-line pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <AvatarStack people={event.attendees} total={event.attendeeCount} max={4} size={26} />
              <span className="truncate text-[13.5px] text-subtle">{countText}</span>
            </div>
            {!cancelled && (
              <span className="shrink-0 text-[14px] font-semibold text-ink">
                {priceLabel(event.entryFee)}
              </span>
            )}
          </div>

          <Link
            to={to}
            className={`btn mt-4 w-full ${isUpcoming && !cancelled ? "btn-primary" : "btn-secondary"}`}
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
