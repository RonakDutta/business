import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_MEETUPS } from "../data/events.js";
import { deriveCollections } from "../lib/events-model.js";

const KEY = "b4:meetups";
const EventsContext = createContext(null);

/* ===========================================================================
   The single source of truth for meetups.

   Records live in state and are mirrored to localStorage, so admin edits
   survive a refresh and show up on the public site immediately. When the SQL
   backend lands, the mutators below become API calls and nothing else in the
   app has to change — that's the whole point of routing every read through
   this hook instead of importing the data module directly.

   Note: once you've edited anything, your browser copy wins over the seed.
   `resetToSeed()` clears it.
   =========================================================================== */

export function EventsProvider({ children }) {
  const [meetups, setMeetups] = useState(SEED_MEETUPS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setMeetups(parsed);
      }
    } catch {
      /* corrupt or unavailable — fall back to the seed */
    }
    setReady(true);
  }, []);

  /*
    Returns whether the write actually stuck.

    This used to swallow the error. That was survivable when a record was a few
    hundred bytes of text; it isn't now that the admin can upload images, where
    a silent failure means photos that look saved, look fine on screen, and are
    gone on refresh. Quota errors travel back to the form instead.
  */
  const persist = useCallback((next) => {
    setMeetups(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      return { ok: true };
    } catch (err) {
      const full = err?.name === "QuotaExceededError" || err?.code === 22;
      return {
        ok: false,
        error: full
          ? "This browser is out of space — the images on this meetup are too large to store. Remove a few and save again."
          : "Couldn't save to this browser. The change is on screen but won't survive a refresh.",
      };
    }
  }, []);

  const collections = useMemo(() => deriveCollections(meetups), [meetups]);

  const getEventById = useCallback(
    (id) => collections.allEvents.find((e) => e.id === id),
    [collections.allEvents]
  );

  const getAlbumById = useCallback(
    (id) => collections.albums.find((a) => a.id === id),
    [collections.albums]
  );

  const getRecord = useCallback(
    (id) => meetups.find((m) => m.date === id),
    [meetups]
  );

  /* The date IS the id, so two meetups can't share one. The form checks this
     before calling, but guard here too — this is the layer that owns it. */
  const addEvent = useCallback(
    (record) => {
      if (meetups.some((m) => m.date === record.date)) {
        return { ok: false, error: "A meetup already exists on that date." };
      }
      const res = persist([...meetups, record]);
      return res.ok ? { ok: true, id: record.date } : res;
    },
    [meetups, persist]
  );

  const updateEvent = useCallback(
    (id, patch) => {
      if (patch.date && patch.date !== id && meetups.some((m) => m.date === patch.date)) {
        return { ok: false, error: "Another meetup already uses that date." };
      }
      const res = persist(meetups.map((m) => (m.date === id ? { ...m, ...patch } : m)));
      return res.ok ? { ok: true, id: patch.date ?? id } : res;
    },
    [meetups, persist]
  );

  /* Moves the count when someone RSVPs. Deliberately not part of updateEvent:
     an RSVP isn't an edit of the meetup, it's an arrival, and it comes from the
     public site rather than the admin form. RsvpContext owns the "have I
     already counted this person" question — see the note there. */
  const addAttendee = useCallback(
    (id, delta = 1) =>
      persist(
        meetups.map((m) =>
          m.date === id
            ? {
                ...m,
                attendeeCount: Math.max(0, (Number(m.attendeeCount) || 0) + delta),
              }
            : m
        )
      ),
    [meetups, persist]
  );

  const setCancelled = useCallback(
    (id, cancelled) =>
      persist(meetups.map((m) => (m.date === id ? { ...m, cancelled } : m))),
    [meetups, persist]
  );

  const removeEvent = useCallback(
    (id) => persist(meetups.filter((m) => m.date !== id)),
    [meetups, persist]
  );

  const resetToSeed = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setMeetups(SEED_MEETUPS);
  }, []);

  const value = useMemo(
    () => ({
      ...collections,
      ready,
      meetups,
      getEventById,
      getAlbumById,
      getRecord,
      addEvent,
      updateEvent,
      addAttendee,
      setCancelled,
      removeEvent,
      resetToSeed,
    }),
    [
      collections, ready, meetups, getEventById, getAlbumById, getRecord,
      addEvent, updateEvent, addAttendee, setCancelled, removeEvent, resetToSeed,
    ]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used inside <EventsProvider>");
  return ctx;
}
