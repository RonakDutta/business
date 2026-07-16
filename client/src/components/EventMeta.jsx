import { CalendarIcon, CalendarPlusIcon, MapPinIcon, ArrowUpRightIcon } from "./icons.jsx";
import { googleCalendarUrl, mapsUrl, isOnline } from "../lib/format.js";

/** The rounded when/where card. Sticks alongside the description on desktop. */
export default function EventMeta({ event }) {
  const { when, location } = event;
  const online = isOnline(location);

  return (
    <aside className="reveal lg:sticky lg:top-28">
      <div className="rounded-panel border border-line bg-white p-2 shadow-[0_10px_30px_-24px_rgba(15,23,42,.35)]">
        {/* When */}
        <div className="flex items-start gap-4 p-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <CalendarIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold leading-snug text-ink">
              {when.headline}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-subtle">
              {when.repeat}
            </div>
          </div>

          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Add to Google Calendar"
            title="Add to Google Calendar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors duration-200 hover:bg-line hover:text-ink"
          >
            <CalendarPlusIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="mx-5 border-t border-line" />

        {/* Where */}
        <div className="flex items-start gap-4 p-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <MapPinIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold leading-snug text-ink">
              {location.name}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-subtle">
              {location.address}
              {location.city ? ` · ${location.city}` : ""}
            </div>
          </div>

          {!online && (
            <a
              href={mapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${location.name} in Google Maps`}
              title="Open in Maps"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors duration-200 hover:bg-line hover:text-ink"
            >
              <ArrowUpRightIcon className="h-[18px] w-[18px]" />
            </a>
          )}
        </div>
      </div>

      {event.helpline && (
        <p className="mt-4 px-1 text-[13px] leading-relaxed text-subtle">
          Trouble finding the venue on the day? Call{" "}
          <a href={`tel:${event.helpline}`} className="font-bold text-accent">
            {event.helpline}
          </a>
          . Directions only — not for questions about the event.
        </p>
      )}
    </aside>
  );
}
