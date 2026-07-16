import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRsvp } from "../context/RsvpContext.jsx";
import { useShare } from "../hooks/useShare.js";
import AttendDialog from "./AttendDialog.jsx";
import { HeartIcon, ShareIcon, CheckIcon } from "./icons.jsx";
import { priceLabel } from "../lib/format.js";

/* ===========================================================================
   RSVP — inline, not floating.

   Replaces the bar that hovered over the bottom of the page. That pattern is
   meetup.com's signature and it read as a copy of it, so the action moved into
   the page instead: it's the stub on the end of the event ticket, where the
   price already is.

   Two placements, one set of logic:
     variant="stub" — the tear-off end of the ticket under the hero
     variant="band" — the closing prompt after the attendee list, so someone
                      who has read to the bottom doesn't have to scroll back

   The floating bar reserved space with pb-32 on the article. That's gone too.
   =========================================================================== */

export default function EventRsvpPanel({ event, variant = "stub" }) {
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
  const band = variant === "band";

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

  const label = isPast
    ? hasPhotos
      ? "View photos"
      : "This meetup has ended"
    : !user
      ? "Sign in to RSVP"
      : going
        ? "You're going ✓"
        : `Attend · ${priceLabel(event.entryFee)}`;

  const isDead = cancelled || (isPast && !hasPhotos);

  const iconBtn = `grid h-10 w-10 shrink-0 place-items-center rounded-full transition-[scale,color,background] duration-200 ease-smooth hover:scale-105 active:scale-95 ${
    band
      ? "text-white/60 hover:bg-white/10 hover:text-white"
      : "text-subtle hover:bg-line hover:text-ink"
  }`;

  const action = isDead ? (
    <span
      className={`block w-full whitespace-nowrap rounded-btn px-6 py-3.5 text-center text-[14px] font-bold ${
        cancelled
          ? "bg-red-50 text-red-600"
          : band
            ? "border border-white/20 text-white/60"
            : "border border-line-strong text-subtle"
      }`}
    >
      {cancelled ? "Cancelled" : label}
    </span>
  ) : (
    <button
      type="button"
      onClick={isPast ? () => navigate(`/gallery/${event.id}`) : onAttend}
      aria-pressed={going || undefined}
      title={going ? "Click to give up your seat" : undefined}
      className={`block w-full whitespace-nowrap rounded-btn px-6 py-3.5 text-center text-[14px] font-bold transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 ${
        band
          ? going
            ? "bg-accent text-white"
            : "bg-white text-ink hover:bg-accent hover:text-white"
          : going
            ? "bg-accent text-white"
            : "bg-ink text-white hover:bg-accent"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {band ? (
        /* ---- Closing prompt ------------------------------------- */
        <div className="reveal mt-16 flex flex-wrap items-center justify-between gap-6 rounded-panel bg-ink p-7 text-white md:p-9">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
              {isPast ? "This one's done" : "Still deciding?"}
            </div>
            <p className="mt-2 max-w-[420px] text-[19px] font-extrabold leading-snug tracking-[-0.025em] md:text-[22px]">
              {isPast
                ? "Come to the next one — same room, every second Saturday."
                : `Two hours, ${priceLabel(event.entryFee)}, and ${event.attendeeCount} people already in the room.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(event.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save this event"}
              className={`${iconBtn} ${saved ? "bg-white/10 text-white" : ""}`}
            >
              <HeartIcon filled={saved} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={share}
              aria-label="Share this event"
              title={shared ? "Link copied" : "Share this event"}
              className={iconBtn}
            >
              {shared ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ShareIcon className="h-5 w-5" />
              )}
            </button>
            <div className="ml-1 w-[190px]">{action}</div>
          </div>
        </div>
      ) : (
        /* ---- Ticket stub ---------------------------------------- */
        <div className="flex flex-col justify-center gap-4 border-t border-line bg-[#fafbfc] p-5 lg:min-w-[240px] lg:border-l lg:border-t-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-subtle">
                {isPast ? "Attended" : "Going"}
              </div>
              <div className="mt-1 text-[22px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
                {event.attendeeCount}
              </div>
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => toggle(event.id)}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved" : "Save this event"}
                className={`${iconBtn} ${saved ? "bg-accent/10 text-accent" : ""}`}
              >
                <HeartIcon filled={saved} className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={share}
                aria-label="Share this event"
                title={shared ? "Link copied" : "Share this event"}
                className={iconBtn}
              >
                {shared ? (
                  <CheckIcon className="h-[18px] w-[18px] text-accent" />
                ) : (
                  <ShareIcon className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          {action}
        </div>
      )}

      <span role="status" aria-live="polite" className="sr-only">
        {shared ? "Link copied to clipboard" : ""}
      </span>

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
