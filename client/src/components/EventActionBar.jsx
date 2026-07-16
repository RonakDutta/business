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

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

/**
 * Floating bar pinned to the bottom of the viewport.
 * The page reserves space for it with pb-32 so it never covers the footer.
 *
 * Pill-shaped rather than a slab, and it leads with the date chip and carries
 * the room with it — the two things that make someone decide. The price is in
 * the button, so the bar states the offer once instead of twice.
 *
 * On a phone the title block used to be hidden entirely, which left the two
 * icons and the button alone in a `justify-between` row — so they sprayed to
 * the corners with a hole in the middle. The title stays now and takes the
 * slack; `share` is what gives way instead, since it's the one thing here you
 * can do from anywhere else on the page.
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

  // The id is the date, so the chip needs no extra field.
  const [, m, d] = event.id.split("-").map(Number);
  const day = d;
  const month = MONTHS[m - 1];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-4 md:pb-6">
        <div className="pointer-events-auto mx-auto grid max-w-[940px] grid-cols-[42px_minmax(0,1fr)_40px] items-center gap-2 rounded-panel border border-line bg-white/95 p-2.5 shadow-[0_18px_45px_-18px_rgba(15,23,42,.45)] backdrop-blur-md sm:flex sm:gap-3 sm:rounded-full md:gap-4 md:p-3 md:pl-4">
          {/* Date chip — same object as on the cards, so the bar reads as a
              continuation of the one you clicked. */}
          <div
            className={`flex w-[42px] shrink-0 flex-col items-center rounded-xl py-1.5 sm:w-[46px] ${
              cancelled ? "bg-red-50 text-red-600" : "accent-tint text-accent"
            }`}
          >
            <span className="text-[16px] font-extrabold leading-none tabular-nums">
              {day}
            </span>
            <span className="mt-0.5 text-[8.5px] font-bold tracking-[0.1em] opacity-70">
              {month}
            </span>
          </div>

          <div className="min-w-0 sm:flex-1">
            <div className="truncate text-[13.5px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[15px]">
              {event.title}
            </div>
            <div className="mt-0.5 flex items-center gap-2 sm:mt-1">
              {event.attendeeCount > 0 && (
                <AvatarStack
                  className="hidden sm:flex"
                  people={event.attendees}
                  total={event.attendeeCount}
                  max={3}
                  size={20}
                />
              )}
              <span className="truncate text-[11.5px] font-semibold text-subtle sm:text-[12px]">
                {event.attendeeCount > 0
                  ? `${event.attendeeCount} ${isPast ? "came" : "going"} · ${event.date}`
                  : event.date}
              </span>
            </div>
          </div>

          <div className="col-span-3 mt-1 flex min-w-0 items-center gap-2 sm:col-auto sm:mt-0 sm:shrink-0 sm:gap-1 md:gap-2.5">
            <button
              type="button"
              onClick={() => toggle(event.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save this event"}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-[scale,color,background] duration-200 ease-smooth hover:scale-105 active:scale-95 sm:h-11 sm:w-11 ${
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
              className="hidden h-11 w-11 shrink-0 place-items-center rounded-full text-subtle transition-[scale,color,background] duration-200 ease-smooth hover:scale-105 hover:bg-line hover:text-ink active:scale-95 sm:grid"
            >
              {shared ? (
                <CheckIcon className="h-5 w-5 text-accent" />
              ) : (
                <ShareIcon className="h-5 w-5" />
              )}
            </button>

            {isDead ? (
              <span
              className={`min-w-0 flex-1 rounded-full px-3 py-3 text-center text-[13px] font-bold sm:flex-none sm:px-5 sm:py-3.5 sm:text-[14px] md:px-7 md:text-[15px] ${
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
                className={`min-w-0 flex-1 rounded-full px-4 py-3 text-center text-[13px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 sm:flex-none sm:px-5 sm:py-3.5 sm:text-[14px] md:px-7 md:text-[15px] ${
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
          user={user}
          onConfirm={(paymentProof) => confirm(event.id, paymentProof)}
          onClose={() => setPayOpen(false)}
        />
      )}
    </>
  );
}
