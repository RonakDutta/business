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
import { events as eventsApi } from "../api";
import { isUploaded, dataUrlToBlob } from "../lib/image.js";

const KEY = "b4:meetups";
const EventsContext = createContext(null);

/*
  VITE_API_URL is the switch (same as AuthContext). Set → read events from the
  backend; unset → the original seed + localStorage, so the app and preview
  keep working with no server.
*/
const hasApi = Boolean(import.meta.env.VITE_API_URL);

/*
  The API returns processed events (status/labels derived server-side); the app
  is built around raw records that lib/events-model turns into events. Map the
  API shape back to a record so deriveCollections and every component keep
  working untouched. Gallery photos come from a separate endpoint — wired later
  — so `photos` is empty for now (the seed still carries its own).
*/
function apiEventToRecord(e) {
  return {
    // The frontend keys events by date (the URL); apiId keeps the server's
    // uuid alongside so the write mutators can target the right resource.
    apiId: e.id,
    date: e.date,
    title: e.title,
    entryFee: e.entryFee,
    attendeeCount: e.attendeeCount,
    description: e.description,
    image: e.image ?? undefined,
    cancelled: e.cancelled,
    location: e.locationOverride || undefined,
    // Cloudinary URLs from the API; events-model treats absolute URLs as
    // already-resolved, so the gallery renders them straight through.
    photos: Array.isArray(e.photos) ? e.photos : [],
  };
}

/* Upload any freshly-picked (data URL) gallery photos to an event; existing
   Cloudinary URLs are left as-is. */
async function uploadNewPhotos(apiId, photos = []) {
  for (const photo of photos) {
    const blob = dataUrlToBlob(photo);
    if (blob) await eventsApi.addPhoto(apiId, { image: blob });
  }
}

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
    let active = true;

    (async () => {
      if (hasApi) {
        // Real mode: the backend is the source of truth. A reachable-but-empty
        // response is honoured (a fresh DB genuinely has no events yet); only a
        // failed request falls back to the seed so the site still renders.
        try {
          const apiEvents = await eventsApi.list();
          if (active) setMeetups(apiEvents.map(apiEventToRecord));
        } catch {
          if (active) setMeetups(SEED_MEETUPS);
        }
      } else {
        // Stub mode: trust the browser's copy, else the seed.
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) setMeetups(parsed);
          }
        } catch {
          /* corrupt or unavailable — fall back to the seed */
        }
      }
      if (active) setReady(true);
    })();

    return () => {
      active = false;
    };
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

  /*
    The mutators are async and branch on `hasApi`:
      - API mode → create/update/delete on the backend (header image + new
        gallery photos stream to Cloudinary), then mirror the result into local
        state so the UI updates without a refetch. Errors come back as
        { ok:false, error } for the form to show.
      - Stub mode → the original localStorage behaviour, unchanged.
    Every one still resolves to { ok, id?, error? }, so callers just await.

    The date IS the id, so two meetups can't share one — guard here even though
    the form checks too.
  */
  const addEvent = useCallback(
    async (record) => {
      if (meetups.some((m) => m.date === record.date)) {
        return { ok: false, error: "A meetup already exists on that date." };
      }

      if (hasApi) {
        try {
          const created = await eventsApi.create({
            date: record.date,
            title: record.title,
            entryFee: record.entryFee,
            attendeeCount: record.attendeeCount,
            description: record.description,
            ...(isUploaded(record.image)
              ? { image: dataUrlToBlob(record.image) }
              : {}),
          });
          await uploadNewPhotos(created.id, record.photos);
          const rec = { ...apiEventToRecord(created), photos: record.photos ?? [] };
          setMeetups((prev) => [...prev, rec]);
          return { ok: true, id: rec.date };
        } catch (err) {
          return { ok: false, error: err?.message || "Couldn't save the meetup." };
        }
      }

      const res = persist([...meetups, record]);
      return res.ok ? { ok: true, id: record.date } : res;
    },
    [meetups, persist]
  );

  const updateEvent = useCallback(
    async (id, patch) => {
      if (patch.date && patch.date !== id && meetups.some((m) => m.date === patch.date)) {
        return { ok: false, error: "Another meetup already uses that date." };
      }

      if (hasApi) {
        const current = meetups.find((m) => m.date === id);
        if (!current?.apiId) {
          return { ok: false, error: "This meetup isn't loaded from the server." };
        }
        try {
          const updated = await eventsApi.update(current.apiId, {
            date: patch.date,
            title: patch.title,
            entryFee: patch.entryFee,
            attendeeCount: patch.attendeeCount,
            cancelled: patch.cancelled,
            description: patch.description,
            ...(isUploaded(patch.image)
              ? { image: dataUrlToBlob(patch.image) }
              : {}),
          });
          await uploadNewPhotos(current.apiId, patch.photos);
          const rec = { ...apiEventToRecord(updated), photos: patch.photos ?? [] };
          setMeetups((prev) => prev.map((m) => (m.date === id ? rec : m)));
          return { ok: true, id: rec.date };
        } catch (err) {
          return { ok: false, error: err?.message || "Couldn't save the changes." };
        }
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
    async (id, cancelled) => {
      if (hasApi) {
        const current = meetups.find((m) => m.date === id);
        if (!current?.apiId) return { ok: false, error: "Not loaded from the server." };
        try {
          const updated = await eventsApi.update(current.apiId, { cancelled });
          const rec = { ...apiEventToRecord(updated), photos: current.photos };
          setMeetups((prev) => prev.map((m) => (m.date === id ? rec : m)));
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err?.message };
        }
      }
      return persist(meetups.map((m) => (m.date === id ? { ...m, cancelled } : m)));
    },
    [meetups, persist]
  );

  const removeEvent = useCallback(
    async (id) => {
      if (hasApi) {
        const current = meetups.find((m) => m.date === id);
        if (!current?.apiId) return { ok: false, error: "Not loaded from the server." };
        try {
          await eventsApi.remove(current.apiId);
          setMeetups((prev) => prev.filter((m) => m.date !== id));
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err?.message };
        }
      }
      return persist(meetups.filter((m) => m.date !== id));
    },
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
