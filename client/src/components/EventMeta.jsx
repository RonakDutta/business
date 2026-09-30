import {
  CalendarIcon,
  CalendarPlusIcon,
  MapPinIcon,
  TicketIcon,
  ArrowUpRightIcon,
} from "./icons.jsx";
import { googleCalendarUrl, mapsUrl, isOnline, priceLabel } from "../lib/format.js";

// When, where and what it costs: the three facts people look for first.

function Fact({ icon: Icon, label, value, note, action }) {
  return (
    <div className="flex items-start gap-4 p-5 sm:p-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-accent">
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="meta-label">{label}</div>
        <div className="mt-1.5 text-[15.5px] font-semibold leading-snug text-ink">{value}</div>
        {note && <div className="mt-1 text-[13.5px] leading-relaxed text-subtle">{note}</div>}
      </div>

      {action}
    </div>
  );
}

export default function EventMeta({ event }) {
  const { when, location } = event;
  const online = isOnline(location);

  return (
    <div className="card grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
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
            className="icon-btn h-9 w-9"
          >
            <CalendarPlusIcon className="h-[18px] w-[18px]" />
          </a>
        }
      />

      <Fact
        icon={MapPinIcon}
        label="Where"
        value={location.shortName ?? location.name}
        note={`${location.address}${location.city ? `, ${location.city}` : ""}`}
        action={
          !online && (
            <a
              href={mapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${location.name} in Google Maps`}
              title="Open in Maps"
              className="icon-btn h-9 w-9"
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
            ? "Paid by UPI when you RSVP"
            : "No charge for this edition"
        }
      />
    </div>
  );
}
