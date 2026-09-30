import AvatarStack from "./AvatarStack.jsx";
import Wordmark from "./Wordmark.jsx";
import { Sparkle, Squiggle, ClayBall } from "./Decor.jsx";

/* ===========================================================================
   A meetup name badge, the kind you stick on at the door. Used on the auth
   pages (it fills in as you type) and when an RSVP is confirmed (it's handed
   to you with the date on the stub).

   `stub` replaces the "N going" corner with any text, e.g. the date.
   `compact` is the slim strip used on phones.
   =========================================================================== */

export default function NameBadge({
  name,
  placeholder,
  greeting,
  event,
  stub,
  compact = false,
  className = "",
}) {
  if (compact) {
    return (
      <div className={`clay-soft clay-edge flex items-center gap-4 overflow-hidden rounded-[22px] border bg-white ${className}`}>
        <div className="relative self-stretch bg-accent px-4 py-3 text-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1.6px)] bg-[length:12px_12px]"
          />
          <div className="relative text-[17px] font-extrabold leading-none">
            Hello
          </div>
          <div className="relative mt-1 text-[11px] font-semibold text-white/80">
            {greeting}
          </div>
        </div>
        <div
          className={`min-w-0 flex-1 truncate py-3 pr-4 text-[20px] font-extrabold tracking-[-0.03em] ${
            name ? "text-ink" : "text-faint"
          }`}
        >
          {name || placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative mx-auto w-full max-w-[400px] ${className}`}>
      {/* Lanyard clip */}
      <div className="relative z-10 mx-auto -mb-3 flex h-9 w-20 items-center justify-center rounded-2xl clay-blue">
        <span className="h-2 w-10 rounded-full bg-accent/25 shadow-[inset_0_1px_2px_rgba(30,58,138,.3)]" />
      </div>

      <div className="clay clay-edge relative -rotate-2 overflow-hidden rounded-[30px] border bg-white">
        {/* Header band */}
        <div className="relative bg-accent px-7 pb-5 pt-7 text-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1.2px,transparent_1.8px)] bg-[length:16px_16px]"
          />
          <div className="relative text-[34px] font-extrabold leading-none tracking-[-0.03em]">
            Hello
          </div>
          <div className="relative mt-1.5 text-[15px] font-semibold text-white/85">
            {greeting}
          </div>
        </div>

        {/* The name line */}
        <div className="px-7 pb-6 pt-8">
          <div
            className={`min-h-[48px] truncate text-[38px] font-extrabold leading-tight tracking-[-0.035em] transition-colors duration-200 ${
              name ? "text-ink" : "text-faint"
            }`}
          >
            {name || placeholder}
          </div>
          <Squiggle className="mt-1 h-3 w-28 text-accent/40" />
        </div>

        {/* Stub */}
        <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-line px-7 py-4">
          <Wordmark size="sm" />
          {stub ? (
            <span className="text-right text-[12px] font-bold leading-snug text-subtle">
              {stub}
            </span>
          ) : event && (
            <div className="flex items-center gap-2">
              <AvatarStack
                people={event.attendees}
                total={event.attendeeCount}
                max={3}
                size={24}
              />
              <span className="text-[12px] font-bold text-subtle">
                {event.attendeeCount} going
              </span>
            </div>
          )}
        </div>
      </div>

      <Sparkle className="bob pointer-events-none absolute -right-4 top-10 h-10 w-10 text-accent [--r:12deg]" />
      <ClayBall className="absolute -bottom-4 -left-5 h-11 w-11" />
    </div>
  );
}

