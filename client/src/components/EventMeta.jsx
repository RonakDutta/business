import {
  CalendarIcon,
  CalendarPlusIcon,
  MapPinIcon,
  TicketIcon,
  ArrowUpRightIcon,
} from "./icons.jsx";
import { googleCalendarUrl, mapsUrl, isOnline, priceLabel } from "../lib/format.js";

/* ===========================================================================
   When / where / what it costs.

   No card chrome of its own — it's the lower half of the ticket in
   EventDetail, below the perforation, so the hero and the facts read as one
   object rather than two things stacked with a gap between them.
   =========================================================================== */

function Fact({ icon: Icon, label, value, note, action }) {
  return (
    <div className="flex items-start gap-3.5 p-5">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-subtle">
          {label}
        </div>
        <div className="mt-1 text-[14.5px] font-bold leading-snug text-ink">
          {value}
        </div>
        {note && (
          <div className="mt-1 text-[12.5px] leading-relaxed text-subtle">
            {note}
          </div>
        )}
      </div>

      {action}
    </div>
  );
}

const actionCls =
  "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-subtle transition-colors duration-200 hover:bg-line hover:text-ink";

export default function EventMeta({ event }) {
  const { when, location } = event;
  const online = isOnline(location);

  return (
    <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <Fact
        icon={CalendarIcon}
        label="When"
        value={when.headline}
        note={when.repeat}
        action={
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Add to Google Calendar"
            title="Add to Google Calendar"
            className={actionCls}
          >
            <CalendarPlusIcon className="h-[18px] w-[18px]" />
          </a>
        }
      />

      <Fact
        icon={MapPinIcon}
        label="Where"
        value={location.shortName ?? location.name}
        note={`${location.address}${location.city ? ` · ${location.city}` : ""}`}
        action={
          !online && (
            <a
              href={mapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${location.name} in Google Maps`}
              title="Open in Maps"
              className={actionCls}
            >
              <ArrowUpRightIcon className="h-[18px] w-[18px]" />
            </a>
          )
        }
      />

      <Fact
        icon={TicketIcon}
        label="Entry"
        value={priceLabel(event.entryFee)}
        note={
          event.entryFee > 0
            ? "Pay securely by UPI when you RSVP"
            : "No charge for this edition"
        }
      />
    </div>
  );
}
