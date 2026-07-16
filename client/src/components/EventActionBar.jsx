import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useShare } from "../hooks/useShare.js";
import AttendDialog from "./AttendDialog.jsx";
import { HeartIcon, ShareIcon, CheckIcon } from "./icons.jsx";
import { priceLabel } from "../lib/format.js";

/**
 * Floating bar pinned to the bottom of the viewport.
 * The page reserves space for it with pb-32 so it never covers the footer.
 */
export default function EventActionBar({ event }) {
  const { isSaved, toggle } = useSavedEvents();
  const { share, shared } = useShare(event);
  const { user } = useAuth();
  const { isGoing, confirm, cancel } = useRsvp();
  const navigate = useNavigate();

  const [payOpen, setPayOpen] = useState(false);

  const saved = isSaved(event.id);
  const going = isGoing(event.id);
  const isPast = event.status === "past";
  const cancelled = event.cancelled;
  const hasPhotos = event.gallery?.length > 0;

  /*
    RSVP is gated on sign-in. Signed out, this sends them to /login with a
    `next` param so they land back on this event afterwards rather than on the
    home page. Signed in, it opens the payment step — the count only moves once
    they confirm in there.
  */
  const onAttend = () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/events/${event.id}`)}`);
      return;
    }
    if (going) {
      cancel(event.id);
      return;
    }
    setPayOpen(true);
  };

  const attendLabel = isPast
    ? hasPhotos
      ? "View photos"
      : "This meetup has ended"
    : !user
      ? "Sign in to RSVP"
      : going
        ? "You're going ✓"
        : `Attend · ${priceLabel(event.entryFee)}`;

  const isDead = cancelled || (isPast && !hasPhotos);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 md:pb-6">
        <div className="pointer-events-auto mx-auto flex max-w-[980px] items-center gap-3 rounded-panel border border-line bg-white/95 p-3 shadow-[0_18px_40px_-20px_rgba(15,23,42,.4)] backdrop-blur-md md:gap-4 md:p-4 md:pl-6">
          {/* Title block — hidden on the smallest screens so actions stay reachable */}
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="text-[11px] font-semibold tracking-[0.04em] text-subtle">
              {event.date}
            </div>
            <div className="truncate text-[17px] font-extrabold tracking-[-0.02em] text-ink">
              {event.title}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between gap-2 sm:flex-none sm:justify-end md:gap-3">
            <span className="hidden rounded-full border border-line-strong px-4 py-2 text-[13px] font-bold text-ink sm:inline">
              {priceLabel(event.entryFee)}
            </span>

            <button
              type="button"
              onClick={() => toggle(event.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save this event"}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[scale,color,background] duration-200 ease-smooth hover:scale-105 active:scale-95 ${
                saved
                  ? "bg-accent/10 text-accent"
                  : "text-subtle hover:bg-line hover:text-ink"
              }`}
            >
              <HeartIcon filled={saved} className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={share}
              aria-label="Share this event"
              title={shared ? "Link copied" : "Share this event"}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent transition-[scale] duration-200 ease-smooth hover:scale-105 active:scale-95"
            >
              {shared ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ShareIcon className="h-5 w-5" />
              )}
            </button>

            {isDead ? (
              <span
                className={`whitespace-nowrap rounded-btn px-5 py-3.5 text-[14px] font-bold md:px-7 md:text-[15px] ${
                  cancelled
                    ? "bg-red-50 text-red-600"
                    : "border border-line-strong text-subtle"
                }`}
              >
                {cancelled ? "Cancelled" : attendLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={isPast ? () => navigate(`/gallery/${event.id}`) : onAttend}
                aria-pressed={going || undefined}
                title={going ? "Click to give up your seat" : undefined}
                className={`whitespace-nowrap rounded-btn px-5 py-3.5 text-[14px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 md:px-7 md:text-[15px] ${
                  going ? "bg-accent" : "bg-ink hover:bg-accent"
                }`}
              >
                {attendLabel}
              </button>
            )}
          </div>

          <span role="status" aria-live="polite" className="sr-only">
            {shared ? "Link copied to clipboard" : ""}
          </span>
        </div>
      </div>

      {payOpen && (
        <AttendDialog
          event={event}
          onConfirm={() => confirm(event.id)}
          onClose={() => setPayOpen(false)}
        />
      )}
    </>
  );
}
