import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useShare } from "../hooks/useShare.js";
import AttendDialog from "./AttendDialog.jsx";
import AvatarStack from "./AvatarStack.jsx";
import { HeartIcon, ShareIcon, CheckIcon } from "./icons.jsx";
import { priceLabel } from "../lib/format.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The bar pinned to the bottom of the event page: the date, the title, who is
 * going, and the one RSVP button. The page reserves space for it with pb-36
 * so it never covers the footer.
 *
 * On a phone it is two rows (details, then a full-width button); from sm up
 * it is a single pill. Share is the control that gives way on small screens,
 * since you can share from anywhere else on the page.
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
    `next` param so they land back on this event afterwards. Signed in, it
    opens the payment step; the count only moves once they confirm in there.
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
        ? "You're going"
        : `RSVP · ${priceLabel(event.entryFee)}`;

  const isDead = cancelled || (isPast && !hasPhotos);

  // The id is the date, so the date block needs no extra field.
  const [, m, d] = event.id.split("-").map(Number);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-5">
        <div className="pointer-events-auto mx-auto grid max-w-[920px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 rounded-panel border border-line bg-white/95 p-3 shadow-float backdrop-blur-md sm:flex sm:rounded-full sm:py-2.5 sm:pl-3 sm:pr-2.5">
          <div
            className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full ${
              cancelled ? "bg-red-50 text-red-700" : "bg-surface text-ink"
            }`}
          >
            <span className="font-display text-[15px] font-semibold leading-none tabular-nums">{d}</span>
            <span className="mt-0.5 text-[10px] font-semibold leading-none text-subtle">{MONTHS[m - 1]}</span>
          </div>

          <div className="min-w-0 sm:flex-1">
            <div className="truncate text-[14.5px] font-semibold leading-tight text-ink sm:text-[15px]">
              {event.title}
            </div>
            <div className="mt-1 flex items-center gap-2">
              {event.attendeeCount > 0 && (
                <AvatarStack
                  className="hidden sm:flex"
                  people={event.attendees}
                  total={event.attendeeCount}
                  max={3}
                  size={20}
                />
              )}
              <span className="truncate text-[12.5px] text-subtle sm:text-[13px]">
                {event.attendeeCount > 0
                  ? `${event.attendeeCount} ${isPast ? "came" : "going"} · ${event.date}`
                  : event.date}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggle(event.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved" : "Save this event"}
            className={`icon-btn sm:hidden ${saved ? "text-accent" : ""}`}
          >
            <HeartIcon filled={saved} className="h-5 w-5" />
          </button>

          <div className="col-span-3 flex min-w-0 items-center gap-1.5 sm:col-auto sm:shrink-0">
            <button
              type="button"
              onClick={() => toggle(event.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save this event"}
              className={`icon-btn hidden sm:inline-grid ${saved ? "text-accent" : ""}`}
            >
              <HeartIcon filled={saved} className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={share}
              aria-label="Share this event"
              title={shared ? "Link copied" : "Share this event"}
              className="icon-btn hidden sm:inline-grid"
            >
              {shared ? <CheckIcon className="h-5 w-5 text-accent" /> : <ShareIcon className="h-5 w-5" />}
            </button>

            {isDead ? (
              <span
                className={`btn w-full cursor-default sm:ml-1.5 sm:w-auto ${
                  cancelled ? "bg-red-50 text-red-700" : "bg-surface text-subtle"
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
                className={`btn w-full sm:ml-1.5 sm:w-auto sm:min-w-[170px] ${going ? "btn-accent" : "btn-primary"}`}
              >
                {going && <CheckIcon />}
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
          user={user}
          onConfirm={(paymentProof) => confirm(event.id, paymentProof)}
          onClose={() => setPayOpen(false)}
        />
      )}
    </>
  );
}
