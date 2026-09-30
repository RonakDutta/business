import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import BackLink from "../components/BackLink.jsx";
import { Orb, ConnectionMesh, ClayBall, ClayCalendar } from "../components/Decor.jsx";
import { CalendarIcon } from "../components/icons.jsx";
import { ServerLoader, EventCardSkeleton } from "../components/ServerLoader.jsx";

const TABS = ["upcoming", "past", "saved"];

const EMPTY = {
  upcoming: {
    title: "No dates up yet",
    body: "The next edition hasn't been announced. It's every second Saturday, check back in a few days.",
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
      <ClayBall className="bob absolute right-[22%] top-16 -z-10 h-8 w-8 sm:h-10 sm:w-10" />
      <Orb className="pointer-events-none absolute -left-20 -top-8 -z-10 h-56 w-56 text-accent blur-2xl sm:h-64 sm:w-64" />
      <ConnectionMesh className="pointer-events-none absolute -right-6 top-2 -z-10 h-36 w-52 text-accent opacity-60 [-webkit-mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] [mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] sm:h-52 sm:w-80 sm:opacity-70 md:-right-4" />

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

      {/* The same pill track as the navbar and the sign-in switch. */}
      <div className="clay-inset mb-9 flex w-full gap-1 rounded-full bg-canvas p-1 sm:inline-flex sm:w-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold transition-[color,background,box-shadow] duration-200 sm:flex-none sm:px-5 ${
              tab === t.id ? "clay bg-white text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className={`rounded-full px-1.5 text-[11.5px] tabular-nums ${
                  tab === t.id ? "accent-tint text-accent" : "text-faint"
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
        <div className="clay-soft clay-edge flex flex-col items-center rounded-panel border bg-white px-6 py-14 text-center">
          <ClayCalendar className="h-auto w-40" />
          <p className="mt-6 text-[19px] font-extrabold tracking-[-0.02em] text-ink">
            {empty.title}
          </p>
          <p className="mx-auto mt-2 max-w-[340px] text-sm leading-relaxed text-muted">
            {empty.body}
          </p>
          {empty.cta && (
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className="clay clay-press mt-6 rounded-btn bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-accent"
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
