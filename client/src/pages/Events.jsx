import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import BackLink from "../components/BackLink.jsx";
import { Orb, ConnectionMesh } from "../components/Decor.jsx";
import { CalendarIcon } from "../components/icons.jsx";
import { ServerLoader, EventCardSkeleton } from "../components/ServerLoader.jsx";

const TABS = ["upcoming", "past", "saved"];

const EMPTY = {
  upcoming: {
    title: "No dates up yet",
    body: "The next edition hasn't been announced. It's every second Saturday , check back in a few days.",
    cta: null,
  },
  past: {
    title: "No archive yet",
    body: "Once a meetup has been and gone it shows up here with its photos.",
    cta: null,
  },
  saved: {
    title: "Nothing saved yet",
    body: "Tap the heart on any event to keep it here. Saved events stay in this browser.",
    cta: "Browse upcoming events",
  },
};

export default function Events() {
  const { saved } = useSavedEvents();
  const { upcomingEvents, pastEvents, ready } = useEvents();

  /* The tab lives in the URL so "Saved events" in the account menu can link
     straight to it, and so a shared link opens where the sender was. */
  const [params, setParams] = useSearchParams();
  const tab = TABS.includes(params.get("tab")) ? params.get("tab") : "upcoming";
  const setTab = (id) =>
    setParams(id === "upcoming" ? {} : { tab: id }, { replace: true });

  const events = useMemo(() => {
    if (tab === "upcoming") return upcomingEvents;
    if (tab === "past") return pastEvents;
    return [...upcomingEvents, ...pastEvents].filter((e) =>
      saved.includes(e.id),
    );
  }, [tab, saved, upcomingEvents, pastEvents]);

  // "Saved" mixes upcoming and past, so pick the card style per event.
  const variantFor = (ev) =>
    tab === "saved"
      ? upcomingEvents.some((u) => u.id === ev.id)
        ? "upcoming"
        : "past"
      : tab;

  useReveal([tab, events.length]);

  const savedCount = [...upcomingEvents, ...pastEvents].filter((e) =>
    saved.includes(e.id),
  ).length;

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcomingEvents.length },
    { id: "past", label: "Past", count: pastEvents.length },
    { id: "saved", label: "Saved", count: savedCount },
  ];

  const empty = EMPTY[tab];

  return (
    <section className="relative isolate mx-auto max-w-shell px-6 pb-24 pt-14 md:px-10">
      {/* Vector backdrop */}
      <Orb className="pointer-events-none absolute -left-20 -top-8 -z-10 h-56 w-56 text-accent blur-2xl sm:h-64 sm:w-64" />
      <ConnectionMesh className="pointer-events-none absolute -right-6 top-2 -z-10 h-36 w-52 text-accent opacity-60 [-webkit-mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] [mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] sm:h-52 sm:w-80 sm:opacity-70 md:-right-4" />

      <div className="reveal flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
        <CalendarIcon className="h-3.5 w-3.5" />
        The calendar
      </div>
      <h1
        data-delay="0.06"
        className="reveal mb-3 mt-2.5 text-[36px] font-extrabold tracking-[-0.03em] md:text-[52px]"
      >
        All{" "}
        <span className="relative whitespace-nowrap text-accent">
          events
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
          />
        </span>
      </h1>
      <p
        data-delay="0.12"
        className="reveal mb-9 max-w-[520px] text-[17px] leading-[1.65] text-muted"
      >
        Every session we've run and everything on the calendar. Members get
        first pick of seats.
      </p>

      <div className="mb-9 flex w-full gap-1 rounded-btn border border-line-strong p-1.5 sm:inline-flex sm:w-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex flex-1 items-center justify-center gap-2 rounded-btn px-3 py-2.5 text-sm font-bold transition-colors duration-300 sm:flex-none sm:px-5 ${
              tab === t.id ? "bg-ink text-white" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className={`text-[12px] tabular-nums ${
                  tab === t.id ? "text-white/50" : "text-faint"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {!ready ? (
        <div className="flex flex-col gap-6">
          <ServerLoader message="Loading events..." hint="Fetching calendar schedule..." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-20 text-center">
          <p className="text-[17px] font-bold text-ink">{empty.title}</p>
          <p className="mx-auto mt-2 max-w-[340px] text-sm leading-relaxed text-muted">
            {empty.body}
          </p>
          {empty.cta && (
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className="mt-6 rounded-btn bg-ink px-6 py-3 text-sm font-bold text-white transition-[translate] duration-300 ease-smooth hover:-translate-y-0.5"
            >
              {empty.cta}
            </button>
          )}
        </div>
      ) : (
        <div
          key={tab}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} variant={variantFor(ev)} />
          ))}
        </div>
      )}
    </section>
  );
}
