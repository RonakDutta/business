import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useEvents } from "./EventsContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import {
  events as eventsApi,
  payments as paymentsApi,
  rsvps as rsvpsApi,
} from "../api";
import { dataUrlToBlob } from "../lib/image.js";

const KEY = "b4:rsvps";
const RsvpContext = createContext(null);

/* ===========================================================================
   Who's going, from this browser's / this account's point of view.

   VITE_API_URL is the switch (like Auth and Events):
   - Set  → the backend owns RSVPs. confirm() uploads the payment proof to
            /api/payments (Cloudinary) then POSTs the RSVP; the attendee count
            moves on the server. The signed-in member's list is loaded from
            /api/rsvps/me, so it follows them across devices.
   - Unset → the original localStorage-only behaviour, so the preview keeps
            working with no server.

   Two things still move together when someone joins: the meetup's attendee
   count (EventsContext, so the admin table updates too) and the list of
   meetups *you* joined (here). Keeping the list here is what makes confirm()
   safe to call twice — the count only moves for a meetup you aren't on yet.

   Sits inside <EventsProvider> and <AuthProvider> because it calls into both.
   =========================================================================== */

const hasApi = Boolean(import.meta.env.VITE_API_URL);

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function RsvpProvider({ children }) {
  const { addAttendee, getRecord } = useEvents();
  const { user } = useAuth();
  const [ids, setIds] = useState(() => (hasApi ? [] : read()));

  // Stub mode mirrors to localStorage; API mode's source of truth is the server.
  useEffect(() => {
    if (hasApi) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* storage unavailable , this session only */
    }
  }, [ids]);

  // API mode: load the signed-in member's RSVPs (keyed by date, like the app).
  useEffect(() => {
    if (!hasApi) return;
    if (!user) {
      setIds([]);
      return;
    }
    let active = true;
    rsvpsApi
      .mine()
      .then((list) => {
        if (active) setIds(list.map((r) => r.event_date));
      })
      .catch(() => {
        /* leave the list empty if we can't reach the server */
      });
    return () => {
      active = false;
    };
  }, [user]);

  const isGoing = useCallback((id) => ids.includes(id), [ids]);

  /*
    confirm(date, submission?) — async, resolves to { ok, error }.
    `submission` is the object AttendDialog assembles (payer + payment +
    paymentProof). For free events it may be undefined.
  */
  const confirm = useCallback(
    async (id, submission) => {
      if (ids.includes(id)) return { ok: true };

      if (hasApi) {
        const apiId = getRecord(id)?.apiId;
        if (!apiId) {
          return { ok: false, error: "This event isn't loaded from the server." };
        }
        try {
          // Upload the payment proof first (if there is one), so a failed
          // upload doesn't leave a seat booked with no matching payment.
          const proofDataUrl = submission?.paymentProof?.imageDataUrl;
          const blob = proofDataUrl ? dataUrlToBlob(proofDataUrl) : null;
          if (blob) {
            await paymentsApi.submitProof({
              proof: blob,
              eventId: apiId,
              payerName: submission?.payer?.name,
              payerEmail: submission?.payer?.email,
              paymentRef: submission?.payment?.reference,
              amount: submission?.payment?.amount,
            });
          }
          await eventsApi.rsvp(apiId, submission?.payment?.reference);

          setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
          addAttendee(id, +1);
          return { ok: true };
        } catch (err) {
          return {
            ok: false,
            error: err?.message || "Couldn't confirm your RSVP. Please try again.",
          };
        }
      }

      // Stub mode: local only.
      setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      addAttendee(id, +1);
      return { ok: true };
    },
    [ids, getRecord, addAttendee],
  );

  const cancel = useCallback(
    async (id) => {
      if (!ids.includes(id)) return { ok: true };

      // Optimistic: update the UI first, then tell the server (best effort).
      setIds((prev) => prev.filter((x) => x !== id));
      addAttendee(id, -1);

      if (hasApi) {
        const apiId = getRecord(id)?.apiId;
        if (apiId) {
          try {
            await eventsApi.cancelRsvp(apiId);
          } catch {
            /* the count reconciles from the server on next load */
          }
        }
      }
      return { ok: true };
    },
    [ids, getRecord, addAttendee],
  );

  const value = useMemo(
    () => ({ ids, isGoing, confirm, cancel, count: ids.length }),
    [ids, isGoing, confirm, cancel],
  );

  return <RsvpContext.Provider value={value}>{children}</RsvpContext.Provider>;
}

export function useRsvp() {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error("useRsvp must be used inside <RsvpProvider>");
  return ctx;
}
