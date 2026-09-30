import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../../context/EventsContext.jsx";
import AvatarStack from "../../components/AvatarStack.jsx";
import { priceLabel } from "../../lib/format.js";
import {
  ArrowUpRightIcon,
  BanIcon,
  CalendarIcon,
  LayersIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TicketIcon,
  TrashIcon,
  UndoIcon,
  UsersIcon,
} from "../../components/icons.jsx";

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

const STATUS = {
  upcoming: { label: "Upcoming", cls: "bg-accent/10 text-accent" },
  past: { label: "Held", cls: "bg-surface-strong text-muted" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700" },
};

/** The id is the date: a chip reads faster than "2026-07-18" in a long list. */
function DateChip({ id, muted = false }) {
  const [y, m, d] = id.split("-").map(Number);
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl ${
          muted ? "bg-surface" : "bg-accent/10"
        }`}
      >
        <span
          className={`font-display text-[15px] font-semibold leading-none tabular-nums ${
            muted ? "text-muted" : "text-accent"
          }`}
        >
          {d}
        </span>
        <span
          className={`text-[9.5px] font-semibold leading-none ${
            muted ? "text-subtle" : "text-accent/80"
          }`}
        >
          {MONTHS[m - 1]}
        </span>
      </div>
      <span className="font-mono text-[12px] text-faint tabular-nums">{y}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-subtle">
        <Icon className="h-4 w-4" />
        <span className="meta-label">{label}</span>
      </div>
      <div className="mt-3 font-display text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink">
        {value}
      </div>
      {hint && <div className="mt-2 text-[13px] text-subtle">{hint}</div>}
    </div>
  );
}

/** The one thing an organiser opens this page to check. */
function Spotlight({ event }) {
  if (!event) {
    return (
      <div className="flex flex-col justify-center rounded-panel border border-dashed border-line-strong bg-white p-7">
        <div className="meta-label">Next meetup</div>
        <p className="mt-3 font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">
          Nothing on the calendar
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          The public site has no upcoming date to show. Add the next Saturday.
        </p>
        <Link to="/admin/events/new" className="btn btn-primary btn-sm mt-5 w-fit">
          <PlusIcon className="h-4 w-4" />
          Add meetup
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-panel bg-ink p-7 text-white">
      <div className="relative">
        <div className="text-[13px] font-semibold text-white/55">Next meetup</div>

        <div className="mt-3 text-[14px] font-semibold text-[color-mix(in_srgb,var(--b4-accent)_45%,white)]">
          {event.when.headline}
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-1.5 block max-w-[420px] font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white hover:text-white/80"
        >
          {event.title}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2.5">
            <AvatarStack
              people={event.attendees}
              total={event.attendeeCount}
              max={5}
              size={28}
              className="[&_span]:ring-ink"
            />
            <span className="text-[13.5px] text-white/70">
              {event.attendeeCount} going
            </span>
          </div>
          <span className="text-[13.5px] text-white/70">
            {priceLabel(event.entryFee)} entry
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to={`/admin/events/${event.id}`} className="btn btn-light btn-sm">
            <PencilIcon className="h-4 w-4" />
            Edit this meetup
          </Link>
          <Link to={`/events/${event.id}`} className="btn btn-outline-light btn-sm">
            Public page
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { allEvents, upcomingEvents, pastEvents, setEventCancelled, removeEvent } =
    useEvents();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const next = upcomingEvents.find((e) => !e.cancelled);

  const totalAttendees = useMemo(
    () => pastEvents.reduce((n, e) => n + e.attendeeCount, 0),
    [pastEvents],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents
      .filter((e) => filter === "all" || e.status === filter)
      .filter(
        (e) => !q || e.title.toLowerCase().includes(q) || e.id.includes(q),
      );
  }, [allEvents, filter, query]);

  const counts = {
    all: allEvents.length,
    upcoming: allEvents.filter((e) => e.status === "upcoming").length,
    past: pastEvents.length,
    cancelled: allEvents.filter((e) => e.cancelled).length,
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Held" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-lg text-subtle transition-colors duration-200";

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-page">Meetups</h1>
          <p className="mt-2 text-[15px] text-muted">
            Everything here is live on the public site the moment you save it.
          </p>
        </div>

        <Link to="/admin/events/new" className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Add meetup
        </Link>
      </header>

      <div className="mt-7 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Spotlight event={next} />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={CalendarIcon}
            label="Scheduled"
            value={counts.upcoming}
            hint="Dates on the calendar"
          />
          <StatCard
            icon={LayersIcon}
            label="Held"
            value={counts.past}
            hint="Editions run"
          />
          <StatCard
            icon={UsersIcon}
            label="Attendees"
            value={totalAttendees.toLocaleString("en-IN")}
            hint="Across past meetups"
          />
          <StatCard
            icon={TicketIcon}
            label="Average turnout"
            value={
              pastEvents.length
                ? Math.round(totalAttendees / pastEvents.length)
                : ","
            }
            hint="People per meetup"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-full border border-line bg-white p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-200 ${
                filter === f.id
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {f.label}
              <span
                className={`text-[11px] tabular-nums ${
                  filter === f.id ? "text-white/50" : "text-faint"
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>

        <label className="relative flex-1 sm:max-w-[260px]">
          <span className="sr-only">Search meetups</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or date"
            className="field h-11 rounded-full pl-10 pr-4 text-[14px]"
          />
        </label>
      </div>

      {/* Table */}
      <div className="card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="border-b border-line bg-surface text-[12px] font-semibold uppercase tracking-[0.05em] text-subtle">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Meetup</th>
                <th className="px-5 py-3">Going</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {rows.map((e) => {
                const status = STATUS[e.status];
                const confirming = confirmId === e.id;

                return (
                  <tr
                    key={e.id}
                    className="group transition-colors duration-150 hover:bg-surface"
                  >
                    <td className="px-5 py-3.5">
                      <DateChip id={e.id} muted={e.isPast || e.cancelled} />
                    </td>

                    <td className="max-w-[300px] px-5 py-3.5">
                      <Link
                        to={`/admin/events/${e.id}`}
                        className="line-clamp-1 text-[14.5px] font-semibold text-ink transition-colors duration-150 hover:text-accent"
                      >
                        {e.title}
                      </Link>
                      <div className="mt-0.5 text-[13px] text-subtle">
                        {priceLabel(e.entryFee)}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <AvatarStack
                          people={e.attendees}
                          total={e.attendeeCount}
                          max={3}
                          size={26}
                        />
                        <span className="text-[13.5px] font-semibold tabular-nums text-muted">
                          {e.attendeeCount}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`badge ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      {confirming ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-muted">
                            Delete for good?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              removeEvent(e.id);
                              setConfirmId(null);
                            }}
                            className="btn btn-sm h-8 bg-red-600 px-3 text-[13px] text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="btn btn-ghost btn-sm h-8 px-2.5 text-[13px]"
                          >
                            Keep
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Link
                            to={`/admin/events/${e.id}`}
                            aria-label={`Edit ${e.title}`}
                            title="Edit"
                            className={`${iconBtn} hover:bg-accent/10 hover:text-accent`}
                          >
                            <PencilIcon className="h-[17px] w-[17px]" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setEventCancelled(e.id, !e.cancelled)}
                            aria-label={
                              e.cancelled
                                ? `Restore ${e.title}`
                                : `Cancel ${e.title}`
                            }
                            title={e.cancelled ? "Restore" : "Cancel"}
                            className={`${iconBtn} hover:bg-line hover:text-ink`}
                          >
                            {e.cancelled ? (
                              <UndoIcon className="h-[17px] w-[17px]" />
                            ) : (
                              <BanIcon className="h-[17px] w-[17px]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmId(e.id)}
                            aria-label={`Delete ${e.title}`}
                            title="Delete"
                            className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                          >
                            <TrashIcon className="h-[17px] w-[17px]" />
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-[16px] font-semibold text-ink">
              {query ? "No meetup matches that" : "Nothing in this list yet"}
            </p>
            <p className="mx-auto mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-muted">
              {query
                ? "Try the date instead. Every meetup is filed under the day it runs."
                : "Add a date and it'll show up here and on the public site."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
