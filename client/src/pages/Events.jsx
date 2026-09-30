import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";

const TABS = ["upcoming", "past", "saved"];

const EMPTY = {
  upcoming: {
    title: "No date announced yet",
    body: "The meetup runs every second Saturday. The next date goes up here a couple of weeks before.",
    cta: null,
  },
  past: {
    title: "No past meetups yet",
    body: "Once a meetup has happened it shows up here with its photos.",
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
    return [...upcomingEvents, ...pastEvents].filter((e) => saved.includes(e.id));
  }, [tab, saved, upcomingEvents, pastEvents]);

  // "Saved" mixes upcoming and past, so pick the card style per event.
  const variantFor = (ev) =>
    tab === "saved"
      ? upcomingEvents.some((u) => u.id === ev.id)
        ? "upcoming"
        : "past"
      : tab;

  useReveal([tab, events.length, ready]);

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
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Events" }]}
        title="Events"
        lead="Every meetup on the calendar, and every one we have run. Members get first pick of seats."
      >
        <div
          role="group"
          aria-label="Filter events"
          className="mt-8 inline-flex w-full gap-1 rounded-full border border-line bg-white p-1 sm:w-auto"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors duration-200 sm:flex-none sm:px-5 ${
                tab === t.id ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`text-[12.5px] tabular-nums ${
                    tab === t.id ? "text-white/60" : "text-faint"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="shell pb-24 pt-10 md:pt-14">
        {!ready ? (
          <LoadingState message="Loading events" />
        ) : events.length === 0 ? (
          <div className="rounded-card border border-dashed border-line-strong px-6 py-20 text-center">
            <p className="text-[17px] font-semibold text-ink">{empty.title}</p>
            <p className="mx-auto mt-2 max-w-[360px] text-[14.5px] leading-relaxed text-muted">
              {empty.body}
            </p>
            {empty.cta && (
              <button
                type="button"
                onClick={() => setTab("upcoming")}
                className="btn btn-primary mt-6"
              >
                {empty.cta}
              </button>
            )}
          </div>
        ) : (
          <div key={tab} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} variant={variantFor(ev)} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
