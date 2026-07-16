import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";

const TABS = ["upcoming", "past", "saved"];

const EMPTY = {
  upcoming: {
    title: "No dates up yet",
    body: "The next edition hasn't been announced. It's every second Saturday — check back in a few days.",
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
  const { upcomingEvents, pastEvents } = useEvents();

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
    <section className="mx-auto max-w-shell px-6 pb-24 pt-14 md:px-10">
      <Link to="/" className="text-sm font-bold text-accent">
        ← Back home
      </Link>

      <h1 className="mb-3 mt-6 text-[36px] font-extrabold tracking-[-0.03em] md:text-[52px]">
        All events
      </h1>
      <p className="mb-9 max-w-[520px] text-[17px] leading-[1.65] text-muted">
        Every session we've run and everything on the calendar. Members get
        first pick of seats.
      </p>

      <div className="mb-9 inline-flex gap-1 rounded-btn border border-line-strong p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex items-center gap-2 rounded-btn px-5 py-2.5 text-sm font-bold transition-colors duration-300 ${
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

      {events.length === 0 ? (
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
